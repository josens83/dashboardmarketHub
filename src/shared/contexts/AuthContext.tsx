import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SubscriptionTier } from '@/shared/types/subscription';
import { supabase } from '@/shared/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradeTier: (tier: SubscriptionTier) => Promise<void>;
  hasFeature: (feature: string) => boolean;
  canUseFeature: (feature: string, count?: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // @ts-ignore
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        const newProfile = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email!,
          subscription_tier: 'free' as SubscriptionTier,
        };

        // @ts-ignore
        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;

        // @ts-ignore
        await supabase.from('subscriptions').insert([{
          user_id: supabaseUser.id,
          tier: 'free',
          status: 'trialing',
        }]);

        setUser({
          id: createdProfile.id,
          email: createdProfile.email,
          name: createdProfile.name,
          subscriptionTier: createdProfile.subscription_tier,
          subscriptionStatus: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          features: ['basic_analytics', 'service_comparison'],
        });
      } else {
        // @ts-ignore
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', profile.id)
          .single();

        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          subscriptionTier: profile.subscription_tier,
          subscriptionStatus: subscription?.status || 'active',
          subscribedAt: subscription?.created_at ? new Date(subscription.created_at) : undefined,
          features: getFeaturesByTier(profile.subscription_tier),
        });
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturesByTier = (tier: SubscriptionTier): string[] => {
    if (tier === 'enterprise' || tier === 'professional') {
      return ['all'];
    } else if (tier === 'basic') {
      return ['basic_analytics', 'service_comparison', 'pdf_export', 'saved_reports'];
    } else {
      return ['basic_analytics', 'service_comparison'];
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await loadUserProfile(data.user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (data.user) await loadUserProfile(data.user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const upgradeTier = async (tier: SubscriptionTier) => {
    if (!user) return;
    try {
      // @ts-ignore
      await supabase.from('users').update({ subscription_tier: tier }).eq('id', user.id);
      // @ts-ignore
      await supabase.from('subscriptions').update({ tier, status: 'active' }).eq('user_id', user.id);
      // @ts-ignore
      await supabase.from('activity_logs').insert([{
        user_id: user.id,
        action: 'subscription_upgraded',
        entity_type: 'subscription',
        metadata: { from: user.subscriptionTier, to: tier },
      }]);

      setUser({
        ...user,
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        subscribedAt: new Date(),
        features: getFeaturesByTier(tier),
      });
    } catch (error) {
      console.error('구독 업그레이드 실패:', error);
      throw error;
    }
  };

  const hasFeature = (feature: string): boolean => {
    if (!user) return false;
    return user.features.includes('all') || user.features.includes(feature);
  };

  const canUseFeature = (feature: string, count?: number): boolean => {
    if (!user) return false;
    if (user.subscriptionTier === 'professional' || user.subscriptionTier === 'enterprise') {
      return true;
    }
    if (user.subscriptionTier === 'basic') {
      if (feature === 'team_collaboration' || feature === 'webhooks' || feature === 'api_access') {
        return false;
      }
      return true;
    }
    if (feature === 'pdf_export' || feature === 'data_export' || feature === 'saved_reports') {
      return false;
    }
    if (feature === 'comparisons' && count && count > 2) {
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        upgradeTier,
        hasFeature,
        canUseFeature,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
