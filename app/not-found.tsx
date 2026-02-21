import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileX, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileX className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
          <CardDescription className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              Here are some helpful links:
            </p>
            <div className="mt-3 space-y-2">
              <Link 
                href="/dashboard" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                <Search className="w-4 h-4 mr-2" />
                Browse Projects
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
