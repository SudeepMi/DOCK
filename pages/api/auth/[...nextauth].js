import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import {FirebaseAdapter} from '@next-auth/firebase-adapter'
import {db} from '../../../firebase'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: "295081910176-lr8l8bb5t8tdesrjmhm948f6336b4i6q.apps.googleusercontent.com",
      clientSecret: "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",
      requestTokenUrl: "https://accounts.google.com/o/oauth2/auth",
      redirect_uri:'https://dock-eight.vercel.app/api/auth/google/callback',
    }),
    // ...add more providers here
  ],
  adapter: FirebaseAdapter(db)
})