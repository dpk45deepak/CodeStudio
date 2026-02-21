import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <p className="text-muted-foreground">{session.user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">GitHub Integration</h2>
          <p className="text-muted-foreground">
            GitHub integration is configured through your authentication settings.
          </p>
        </div>
      </div>
    </div>
  )
}
