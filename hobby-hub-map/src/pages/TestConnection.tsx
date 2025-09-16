import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const TestConnection: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testLogin = async () => {
    setIsLoading(true);
    setTestResult('Testing login...');
    
    try {
      const response = await fetch('http://localhost:5256/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmailOrUsername: 'test@example.com',
          Password: 'password123'
        })
      });

      const data = await response.json();
      setTestResult(`Login test result: ${JSON.stringify(data, null, 2)}`);
      
      if (response.ok) {
        toast({
          title: "Connection Test Successful",
          description: "Backend is responding correctly",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Test Failed",
          description: data.message || "Login failed",
        });
      }
    } catch (error: any) {
      setTestResult(`Error: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRegister = async () => {
    setIsLoading(true);
    setTestResult('Testing registration...');
    
    try {
      const response = await fetch('http://localhost:5256/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: 'testuser' + Date.now(),
          Email: 'test' + Date.now() + '@example.com',
          Password: 'password123',
          FirstName: 'Test',
          LastName: 'User'
        })
      });

      const data = await response.json();
      setTestResult(`Registration test result: ${JSON.stringify(data, null, 2)}`);
      
      if (response.ok) {
        toast({
          title: "Registration Test Successful",
          description: "User created successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration Test Failed",
          description: data.message || "Registration failed",
        });
      }
    } catch (error: any) {
      setTestResult(`Error: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Test Backend Connection</h2>
        <p className="mt-2 text-center text-gray-600">
          Test the connection between frontend and backend
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Button 
              onClick={testLogin} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Login'}
            </Button>
            
            <Button 
              onClick={testRegister} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Registration'}
            </Button>
          </div>

          {testResult && (
            <div className="mt-6">
              <Label>Test Result:</Label>
              <pre className="mt-2 p-4 bg-gray-100 rounded-md text-sm overflow-auto max-h-96">
                {testResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
