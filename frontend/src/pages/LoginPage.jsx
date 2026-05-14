import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore' // import useAuthStore to access login function and loading state  
import { EyeOff, Eye, User, Mail, Lock, MessageSquare, Loader2 } from 'lucide-react'
import AuthImagePattern from '../components/AuthImagePattern'
import {Link} from 'react-router-dom'

const LoginPage = () => { // define LoginPage component
  const [showPassword, setShowPassword] = useState(false); // state to toggle password visibility
  const [formData, setFormData] = useState({ // state to manage form data
    email:"", 
    password:""
  })

  const {login, isLoggingIn} = useAuthStore();// get login function and loading state from auth store
  const handleSubmit = async (e) => { // handle form submission
    e.preventDefault(); // prevent default form submission behavior
    login(formData); // call login function from auth store with form data
  }

  return (
    <div className='min h-screen grid lg:grid-cols-2'>
      {/* Left side with image */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* logo)*/}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                < MessageSquare className="size-6 text-primary"/>
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className='text-base-content/60'>Sign in to your account</p>
            </div>
          </div>
    
        <form onSubmit={handleSubmit} action="" className='space-y-6'>
          <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Email</span> 
                            </label>
    
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                                    {/* Icon */}
                                    <Mail className = "size-5 text-base-content/40"/>
                                </div>
                                <input  type="email"
                                        className={`input input-bordered w-full pl-10`}
                                        placeholder='you@example.com'
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                                
                            </div>
                        </div>
    
                         <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Password</span> 
                            </label>
    
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                                    {/* Icon */}
                                    <Lock className = "size-5 text-base-content/40"/>
                                </div>
                                <input  type={showPassword ? "text" : "password"}
                                        className={`input input-bordered w-full pl-10`}
                                        placeholder='........'
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                />
                                
                                <button type="button" className='absolute inset-y-0 right-0 pr-3 flex items-center z-10' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? 
                                    (<EyeOff className='size-5 text-base-content/40'/>):
                                    (<Eye className="size-5 text-base-content/40"/>)
                                }
                                </button>
                            </div>
                        </div>
    
                        <button type="submit" className='btn btn-primary w-full' disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                <Loader2 className='size-5 animate-spin mr-2'/> 
                                Loading...
                                </>
                            ) :("Sign In")}
                        </button>
                    </form>
    
                    <div className='text-center'>
                        <p className='text-base-content/60'>
                            Don't have an account? {""}
                            <Link to="/signup" className="link link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
    
            {/* Right side with image */}
            <AuthImagePattern title="Join Our Community" subtitle="Connect with friends,
            share moments and stay in touch with your loved ones"/>
        </div>
  )
}

export default LoginPage