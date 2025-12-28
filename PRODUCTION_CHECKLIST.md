# 🔒 Production Security & Build Checklist

## Pre-Deployment Security Checklist

### Environment Variables
- [ ] All sensitive credentials are stored as environment variables (not in code)
- [ ] `.env` files are listed in `.gitignore`
- [ ] Different values for development and production environments
- [ ] JWT_SECRET is at least 32 characters long and randomly generated
- [ ] MongoDB connection string uses strong password
- [ ] Using production/live Paystack keys (not test keys)

### Authentication & Authorization
- [ ] Default admin password has been changed from `Admin123!`
- [ ] Admin routes are protected with authentication middleware
- [ ] JWT tokens use httpOnly cookies
- [ ] Password hashing uses bcrypt with sufficient salt rounds

### API Security
- [ ] CORS is properly configured with allowed origins
- [ ] Rate limiting implemented (if handling high traffic)
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (using Mongoose parameterized queries)
- [ ] XSS protection enabled

### Database Security
- [ ] MongoDB Atlas network access is restricted (not 0.0.0.0/0 in production)
- [ ] Database user has minimum required privileges
- [ ] Connection string is properly secured
- [ ] Backups are configured

### HTTPS & Network
- [ ] Frontend is served over HTTPS (Vercel does this automatically)
- [ ] Backend is served over HTTPS (Railway/Render do this automatically)
- [ ] No sensitive data in URLs or logs
- [ ] Secure cookies configuration

### Payment Security
- [ ] Using Paystack live keys for production
- [ ] Test keys completely removed from production environment
- [ ] Payment webhooks are verified
- [ ] Customer payment data is never stored locally

### Dependencies
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Update packages with security patches
- [ ] Remove unused dependencies

## Production Build Configuration

### Backend Build

No build step needed for Node.js, but ensure:

**package.json scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "seed": "node src/seed.js"
  }
}
```

**Environment:**
- `NODE_ENV=production`
- Remove development dependencies from production
- Enable error logging (but not sensitive data)

### Frontend Build

**Build command:**
```bash
npm run build
```

**Optimize vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,  // Disable source maps in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

## Performance Optimization

### Frontend
- [ ] Images are optimized and compressed
- [ ] Code splitting is enabled
- [ ] CSS is minified
- [ ] Lazy loading for routes
- [ ] Caching headers configured

### Backend
- [ ] Database queries are optimized with indexes
- [ ] API responses are paginated where appropriate
- [ ] Compression middleware enabled
- [ ] Connection pooling configured for MongoDB

### Database Indexes

Add indexes to improve query performance:

```javascript
// In your models
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ createdAt: -1 });
```

## Monitoring & Logging

### Application Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor application performance
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure log aggregation

### Database Monitoring
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up alerts for high CPU/memory usage
- [ ] Track slow queries

### Email Delivery
- [ ] Monitor email delivery rates
- [ ] Check spam folder rates
- [ ] Set up bounce/complaint handling

## Post-Deployment Tasks

### Immediate
1. Test all critical flows end-to-end
2. Verify payment processing works
3. Test email delivery
4. Check error logs for issues
5. Monitor resource usage

### Within first week
1. Review analytics and error logs daily
2. Monitor customer feedback
3. Check payment success rates
4. Verify order confirmation emails
5. Test from different devices/browsers

### Ongoing
1. Weekly security updates check
2. Monthly backup verification
3. Quarterly security audit
4. Regular password rotation for admin accounts

## Emergency Procedures

### If Site Goes Down
1. Check hosting platform status page
2. Review application logs
3. Verify environment variables
4. Check database connectivity
5. Contact hosting support if needed

### If Payment Fails
1. Check Paystack dashboard for errors
2. Verify API keys are correct (live mode)
3. Check webhook configuration
4. Contact Paystack support

### If Database Issues
1. Check MongoDB Atlas status
2. Verify connection string
3. Check network access rules
4. Review database logs
5. Contact MongoDB support

## Rollback Plan

If deployment fails:

1. **Vercel Frontend:**
   ```bash
   vercel rollback
   ```
   Or use Vercel dashboard → Deployments → Promote previous deployment

2. **Railway/Render Backend:**
   - Revert to previous deployment in dashboard
   - Or push previous Git commit and redeploy

3. **Database:**
   - Use MongoDB Atlas backup to restore
   - Or run mongorestore with backup file

## Compliance & Legal

- [ ] Privacy policy added to website
- [ ] Terms of service available
- [ ] Cookie consent (if required in your region)
- [ ] GDPR compliance (if serving EU customers)
- [ ] Payment gateway compliance (PCI DSS - handled by Paystack)

## Success Metrics

Track these KPIs after deployment:

- Uptime percentage (target: 99.9%)
- Page load time (target: < 2 seconds)
- API response time (target: < 500ms)
- Payment success rate (target: > 95%)
- Email delivery rate (target: > 98%)
- Error rate (target: < 0.1%)

---

## Quick Security Audit Commands

```bash
# Check for security vulnerabilities
npm audit

# Fix automatically fixable vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update

# Check bundle size (frontend)
npm run build
du -sh frontend/dist
```

---

## Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Node.js Security Best Practices**: https://nodejs.org/en/docs/guides/security/
- **MongoDB Security Checklist**: https://docs.mongodb.com/manual/administration/security-checklist/
- **Vercel Security**: https://vercel.com/docs/security
- **Railway Security**: https://docs.railway.app/reference/security

---

**Remember**: Security is an ongoing process, not a one-time task. Regular audits and updates are essential!
