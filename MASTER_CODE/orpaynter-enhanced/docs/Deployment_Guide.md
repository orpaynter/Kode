# OrPaynter Software Deployment & Distribution Guide

## 1. Software Build Process
We have successfully compiled the production build of the OrPaynter frontend.

*   **Build Command:** `npm run build:prod`
*   **Output Directory:** `dist/`
*   **Artifact:** `orpaynter-v1.0.0.zip`

### Release Integrity
To ensure security, all releases are signed with a SHA-256 checksum.
*   **Current Release Hash:** `E09BFD469EC84562961A112F709D2B6F83180942623909A04B102FF9ADD31CC4`

## 2. Hosting Strategy
For high availability and global distribution, we recommend the following tiered hosting strategy:

### Tier 1: Cloud Object Storage (Primary)
*   **Provider:** AWS S3 (Simple Storage Service)
*   **Bucket Configuration:** Public Read Access (for specific file), Versioning Enabled.
*   **URL Pattern:** `https://downloads.orpaynter.com/releases/v1.0.0/orpaynter-v1.0.0.zip`

### Tier 2: CDN Acceleration (Performance)
*   **Provider:** Cloudflare or AWS CloudFront
*   **Benefit:** Caches the large ZIP file at edge locations closer to the user, reducing download times by up to 60%.

### Tier 3: GitHub Releases (Open Source / Developer Fallback)
*   **Method:** Attach the `.zip` binary to a GitHub Tag.
*   **Benefit:** Free hosting, version history, and developer trust.

## 3. Implementation Plan
1.  **Upload:** `aws s3 cp orpaynter-v1.0.0.zip s3://orpaynter-releases/v1.0.0/`
2.  **Verify:** Download the file from the public URL and check the hash.
3.  **Publish:** Update the "Download" page on the marketing site with the new link and hash.

## 4. Emergency Rollback
If a critical bug is found:
1.  Revert the "Latest" pointer on the S3 bucket to the previous version.
2.  Purge the CDN cache immediately.
