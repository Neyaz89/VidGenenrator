# 🔒 Security Guidelines

## API Key Management

### ⚠️ CRITICAL: Never Commit API Keys

**DO NOT commit these files:**
- `backend-node/.env`
- `backend/.env`
- `frontend/.env.local`
- Any file containing API keys

### ✅ Proper Setup

1. **Use `.env.example` files** (safe to commit)
2. **Copy to `.env`** (never commit)
3. **Add your keys** to `.env` only

### Example Setup

```bash
# Backend
cd backend-node
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Frontend
cd frontend
cp .env.example .env.local
# Edit .env.local and add NEXT_PUBLIC_API_URL
```

## Environment Variables

### Backend (`backend-node/.env`)

```env
GROQ_API_KEY=your_actual_key_here
FRONTEND_URL=http://localhost:3000
PORT=8000
```

**Never share or commit this file!**

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note:** Only `NEXT_PUBLIC_*` variables are exposed to browser.

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] No API keys in source code
- [ ] No API keys in frontend code
- [ ] `.env.example` has placeholder values only
- [ ] Production keys are different from development
- [ ] API keys are rotated regularly

## If You Accidentally Commit Keys

1. **Immediately revoke the key**
   - Groq: https://console.groq.com → Delete key
   
2. **Generate new key**
   - Create fresh API key
   
3. **Update `.env` file**
   - Add new key locally
   
4. **Remove from Git history** (if needed)
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend-node/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

5. **Force push** (use with caution)
   ```bash
   git push origin --force --all
   ```

## Production Deployment

### Render.com (Backend)
- Add environment variables in dashboard
- Never commit production keys

### Vercel (Frontend)
- Add environment variables in project settings
- Use different keys for production

## Best Practices

1. **Separate Keys** - Use different keys for dev/staging/prod
2. **Rotate Regularly** - Change keys every 90 days
3. **Limit Permissions** - Use least privilege principle
4. **Monitor Usage** - Check API usage regularly
5. **Rate Limiting** - Implement rate limits on backend

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@yourproject.com**

Do NOT create public GitHub issues for security problems.

---

**Remember: Security is everyone's responsibility!**
