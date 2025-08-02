import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, Sparkles, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Check if Supabase is properly configured
            if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
                throw new Error('Supabase não está configurado. Verifique o ficheiro .env.local');
            }

            const { data, error } = isSignUp 
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            if (data.user) {
                onLoginSuccess(data.user);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        setError('');

        try {
            // Check if Supabase is properly configured
            if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
                throw new Error('Supabase não está configurado. Verifique o ficheiro .env.local');
            }

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) throw error;
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Widget de Boas-vindas para Kavita */}
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 shadow-2xl animate-pulse">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                                <Sparkles size={32} className="text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <Heart size={20} className="text-red-400 animate-bounce" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Olá, Kavita! 👋
                        </h1>
                        <p className="text-pink-200 text-sm leading-relaxed">
                            Bem-vinda ao seu <span className="font-semibold text-purple-300">Felex Manager</span>! 
                            <br />
                            Estamos aqui para tornar sua gestão de conteúdo mais fácil e eficiente.
                        </p>
                        <div className="mt-3 flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                </div>

                {/* Logo and Title */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <Chrome size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isSignUp ? 'Criar Conta' : 'Entrar'}
                    </h2>
                    <p className="text-gray-400">
                        {isSignUp 
                            ? 'Comece sua jornada com o AutoPost AI' 
                            : 'Bem-vindo de volta ao AutoPost AI'
                        }
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                    <form onSubmit={handleEmailLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                                        {/* Error Message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Supabase Configuration Warning */}
                {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
                    <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-3 text-yellow-300 text-sm">
                        <p className="font-semibold mb-1">⚠️ Configuração Necessária</p>
                        <p>Para usar a autenticação, configure o Supabase seguindo o guia em <strong>SUPABASE_SETUP.md</strong></p>
                    </div>
                )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {isSignUp ? 'Criando conta...' : 'Entrando...'}
                                </div>
                            ) : (
                                isSignUp ? 'Criar Conta' : 'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800/50 text-gray-400">ou continue com</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSocialLogin('github')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Github size={20} className="mr-2" />
                            Continuar com GitHub
                        </button>
                    </div>

                    {/* Toggle Sign Up/Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                {isSignUp ? 'Entrar' : 'Criar conta'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm">
                    <p>© 2024 AutoPost AI. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 