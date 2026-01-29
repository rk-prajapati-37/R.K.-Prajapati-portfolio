# 🎯 Instagram Profile Setup Guide (Sanity CMS)

## ✅ अब तुम्हारे पास ये Schema हैं:

### 1️⃣ **socialMedia** - सिर्फ Links
- Platform (dropdown)
- URL
- Display Order
- Active status

### 2️⃣ **socialProfile** (नया!) - पूरा Profile
- ✓ Platform (Instagram, Twitter, LinkedIn, etc.)
- ✓ Username (@terehandle)
- ✓ Profile URL (https://instagram.com/terehandle)
- ✓ Profile Picture (image upload)
- ✓ Bio ("Developer | Designer | Content Creator")
- ✓ Followers (1500)
- ✓ Total Posts (245)
- ✓ Verified Badge (✓)
- ✓ Engagement Rate (3.5%)
- ✓ Additional Description
- ✓ Active status

---

## 🚀 Sanity Studio में कैसे Use करें:

### Step 1: Schema Deploy करो
```bash
cd sanity-studio  # या जहाँ तुम्हारा Sanity studio है
sanity deploy
```

### Step 2: Sanity Studio खोलो
```bash
sanity start
```

### Step 3: नया Document Create करो
1. Sanity Studio में जाओ
2. **"Social Media Profile Details"** पर क्लिक करो
3. Fill करो:
   ```
   Platform: Instagram
   Username: @terehandle
   Profile URL: https://instagram.com/terehandle
   Profile Picture: [अपनी फोटो अपलोड करो]
   Bio: Developer | Designer | Content Creator
   Followers: 1500
   Total Posts: 245
   Verified Badge: ✓ (check करो)
   Engagement Rate: 3.5
   Description: [कोई भी extra details]
   Active: ✓ (checked)
   ```

4. **Publish** करो

---

## 📱 Frontend में Display करने के लिए:

### नया Component बनाओ: `components/SocialProfiles.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { sanityServerClient } from '@/lib/sanityServerClient';
import { urlFor } from '@/lib/sanityClient';
import { FaCheckCircle } from 'react-icons/fa';

interface SocialProfile {
  _id: string;
  platform: string;
  username: string;
  profileUrl: string;
  profilePicture: any;
  bio: string;
  followers: number;
  totalPosts: number;
  verified: boolean;
  engagementRate: number;
  active: boolean;
}

const query = `*[_type == "socialProfile" && active == true] {
  _id,
  platform,
  username,
  profileUrl,
  profilePicture,
  bio,
  followers,
  totalPosts,
  verified,
  engagementRate
}`;

export default function SocialProfiles() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await sanityServerClient.fetch(query);
        setProfiles(data);
      } catch (error) {
        console.error('Error fetching social profiles:', error);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <a
          key={profile._id}
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          {/* Profile Picture */}
          {profile.profilePicture && (
            <img
              src={urlFor(profile.profilePicture).url()}
              alt={profile.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          )}

          {/* Username + Verified */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 className="text-xl font-bold">{profile.username}</h3>
            {profile.verified && (
              <FaCheckCircle className="text-blue-500" />
            )}
          </div>

          {/* Platform */}
          <p className="text-gray-500 text-center text-sm mb-3">
            {profile.platform.toUpperCase()}
          </p>

          {/* Bio */}
          <p className="text-gray-700 text-center mb-4">{profile.bio}</p>

          {/* Stats */}
          <div className="flex justify-around text-center border-t pt-4">
            <div>
              <p className="font-bold text-lg">
                {(profile.followers / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profile.totalPosts}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profile.engagementRate}%</p>
              <p className="text-xs text-gray-500">Engagement</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
```

---

## 🎨 Page में Use करो:

अपने `app/social/page.tsx` में:

```tsx
import SocialProfiles from '@/components/SocialProfiles';
import SocialLinks from '@/components/SocialLinks';

export default function SocialPage() {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold">My Social Profiles</h2>
      <SocialProfiles />
      
      <h2 className="text-3xl font-bold">Follow Me On All Platforms</h2>
      <SocialLinks />
    </div>
  );
}
```

---

## 🔄 Query Examples:

### सभी Profiles fetch करो:
```groq
*[_type == "socialProfile" && active == true]
```

### सिर्फ Instagram:
```groq
*[_type == "socialProfile" && platform == "instagram"][0]
```

### सबसे ज्यादा Followers:
```groq
*[_type == "socialProfile"] | order(followers desc)
```

---

## ✨ अब तुम्हारे पास है:

✅ Profile Picture दिखाने के लिए  
✅ Bio/About दिखाने के लिए  
✅ Followers count  
✅ Posts count  
✅ Verified badge (✓)  
✅ Engagement rate  
✅ Multiple platforms support  

**सब कुछ काम करेगा! 🎉**
