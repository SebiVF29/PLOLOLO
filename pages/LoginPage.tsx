import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { supabase } from '../services/supabaseClient';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    if (!email || !password || (!isLoginView && !name)) {
        setError("Please fill all fields");
        setLoading(false);
        return;
    }

    try {
        if (isLoginView) { // Login
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            // AuthProvider will handle navigation
        } else { // Sign Up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    }
                }
            });
            if (error) throw error;
            // Check if user object is present but session is not, which implies email verification is needed.
            if (data.user && !data.session) {
                setMessage("Sign up successful! Please check your email to verify your account before logging in.");
            }
        }
    } catch (err: any) {
        setError(err.error_description || err.message);
    } finally {
        setLoading(false);
    }
  };

  const featureList = [
      {
          icon: 'sparkles' as const,
          title: 'AI-Powered Scheduling',
          description: 'Upload your syllabus and let Chronofy auto-populate your calendar with deadlines, exams, and classes.'
      },
      {
          icon: 'home' as const,
          title: 'All-in-One Hub',
          description: 'Manage classes, tasks, exams, and even your work schedule in one beautifully organized space.'
      },
      {
          icon: 'cog' as const,
          title: 'Personalized For You',
          description: 'Choose your theme, set a custom background, and make the app feel truly like your own personal assistant.'
      }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-primary via-secondary to-accent animated-gradient">
      <div className="container mx-auto w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 items-center gap-16">
              <div className="text-white hidden lg:block">
                  <div className="flex items-center gap-4 mb-4">
                     <Icon name="academic-cap" className="w-16 h-16"/>
                     <h1 className="text-6xl font-bold">Chronofy</h1>
                  </div>
                  <p className="text-2xl mb-10 opacity-90 leading-relaxed">
                      Your academic life, simplified and supercharged.
                  </p>
                  <ul className="space-y-6">
                      {featureList.map(feature => (
                          <li key={feature.title} className="flex items-start gap-4">
                              <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                                <Icon name={feature.icon} className="w-6 h-6"/>
                              </div>
                              <div>
                                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                                  <p className="opacity-80">{feature.description}</p>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>

              <Card className="w-full bg-card/80 backdrop-blur-lg border border-white/20">
                <div className="text-center mb-8">
                    <Icon name="academic-cap" className="w-16 h-16 text-primary mx-auto mb-4 lg:hidden" />
                    <h2 className="text-3xl font-bold text-card-foreground">Welcome!</h2>
                    <p className="text-card-foreground/70 mt-2">
                        {isLoginView ? 'Log in to simplify your life.' : 'Create an account to get started.'}
                    </p>
                </div>

                {error && <p className="mb-4 text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                {message && <p className="mb-4 text-center text-green-500 bg-green-500/10 p-3 rounded-lg">{message}</p>}
                
                <form onSubmit={handleAuthAction} className="space-y-4">
                    <fieldset disabled={loading} className="space-y-4">
                        {!isLoginView && (
                            <Input 
                                label="Full Name" 
                                id="name"
                                type="text" 
                                placeholder="e.g., Sebastian" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<Icon name="user" className="w-5 h-5 text-gray-400" />}
                                required 
                            />
                        )}
                        <Input 
                            label="University Email" 
                            id="email"
                            type="email" 
                            placeholder="sebastian@university.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Icon name="mail" className="w-5 h-5 text-gray-400" />}
                            required
                        />
                        <Input 
                            label="Password" 
                            id="password"
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Icon name="lock" className="w-5 h-5 text-gray-400" />}
                            required 
                        />

                        <Button type="submit" className="w-full text-lg !mt-6" variant="primary">
                            {loading ? (isLoginView ? 'Logging In...' : 'Creating Account...') : (isLoginView ? 'Log In' : 'Create Account')}
                        </Button>
                    </fieldset>
                </form>

                <div className="mt-6 text-center">
                    <button 
                      onClick={() => { setIsLoginView(!isLoginView); setError(null); setMessage(null); }} 
                      className="text-sm text-primary hover:underline"
                      disabled={loading}
                    >
                      {isLoginView ? "Don't have an account? Create one" : 'Already have an account? Log in'}
                    </button>
                </div>
              </Card>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
