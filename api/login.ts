
import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import { promises as fs } from 'fs';

// Helper function to read the user data from the JSON file.
async function getUsersData() {
  // Construct a path to the users.json file that works reliably in Vercel's serverless environment.
  const jsonPath = path.join(process.cwd(), 'api', 'users.json');
  const fileContents = await fs.readFile(jsonPath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const users = await getUsersData();
    
    // NOTE: This is a demo implementation. In a real application, passwords must be hashed and securely compared.
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // IMPORTANT: Never send the password back to the client
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ user: userWithoutPassword });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Failed to read or parse users.json:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}