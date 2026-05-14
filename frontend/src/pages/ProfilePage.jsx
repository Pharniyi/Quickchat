import React from 'react'
import { Camera} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { User, Mail } from 'lucide-react'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

const handleImageUpload = async(e) => {

}
  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2 '>Your profile information</p>
          </div>

          {/* avatar upload section*/}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img src={authUser?.profilePic || "/avatar.png"} alt="Profile Picture" className='size-32 rounded-full object-cover border-4' />
              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}>
                <Camera className='size-5 text-base-200' />
                <input type="file" id="avatar-upload" className='hidden' accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to change your profile picture"}
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <User className='size-4' />
                  Full Name
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                  {authUser?.fullName} {/* to show the full name of the authenticated user, which is retrieved from the authUser object in the auth store. This allows the user to see their registered full name on their profile page, providing a reference for their account information. */}
                </p>
            </div>

            <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <Mail className='size-4' />
                  Email Address
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                  {authUser?.email} {/* to show the email address of the authenticated user, which is retrieved from the authUser object in the auth store. This allows the user to see their registered email address on their profile page, providing a reference for their account information and confirming that they are logged in with the correct email. */}
                </p>
            </div>
          </div>

          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-lg font-medium mb-4'>Account Information</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T") [0]}</span> {/* to show the date when the authenticated user created their account, which is retrieved from the authUser object in the auth store. The createdAt property is typically a timestamp that includes both date and time, so we split it at the "T" character and take the first part (the date) to display it in a more user-friendly format. This allows the user to see how long they have been a member of the platform, providing a sense of their account history and longevity. */}
              </div>

              <div className='flex items-center justify-between py-2'>
                <span>Account Status</span>
                <span className='text-green-500'>Active</span>
              </div>
          </div>

        </div>

      </div>
    </div>
    </div>
  )
}

export default ProfilePage