
import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import { promises as fs } from 'fs';

// FIX: Import 'process' to provide correct types for process.cwd()
import process from 'process';

// Helper function to read the user data and strip passwords.
async function getUsersList() {
  const jsonPath = path.join(process.cwd(), 'api', 'users.json');
  const fileContents = await fs.readFile(jsonPath, 'utf8');
  const users = JSON.parse(fileContents);

  // Omit passwords from the response for security
  return users.map(({ password, ...user }: any) => user);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' });
  }
  
  // In a real app, you would verify an admin token here.
  // For this demo, client-side logic controls access to the admin page that calls this API.

  try {
    const usersWithoutPasswords = await getUsersList();
    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    console.error('Failed to read or parse users.json:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
