# My Cover Letter/Resume/Portfolio

This repository powers my personal resume website.

## About

This is my resume and portfolio site content for [brandonsanders.org](https://brandonsanders.org).

![alt text](image.png)

## Hosting

[brandonsanders.org](https://brandonsanders.org) is hosted on Kubernetes using the Docker image built from the `dockerfile` in this repository.
A prebuilt image is also available on Docker Hub at `brandonsanders/resumeportfolio`.

## Live Editing

This project allows me to edit my resume and cover letter on the fly through the built-in editor pages, so I can quickly update content without a full rebuild workflow.

## Technical Details

### Stack and Runtime

- **Web runtime:** PHP 8.2 with Apache (`php:8.2-apache`) serves the site and editor UI.
- **Container image:** Built from this repository’s `dockerfile` and deployed in Kubernetes for `brandonsanders.org`.
- **PDF toolchain:** Node.js + Puppeteer + `pdf-lib` are installed in the same container to generate and post-process resume PDFs.

### How Deployment Is Accomplished

- The Docker image bakes the application source into `/app-source` and copies it to `/var/www/html`.
- `docker-entrypoint.sh` seeds `/var/www/html` from `/app-source` when a fresh/empty mounted volume is detected.
- Kubernetes runs this image as the web workload, so the same image handles both public site traffic and editor operations.

### How On-the-Fly Editing Works

- The editor is implemented in `editor/index.php` and manages both `Resume.html` and `Cover.html`.
- Authenticated sessions are required (`password_verify`-based login), with CSRF tokens on form actions.
- Saving writes edited HTML directly to the active document file using server-side file writes, making updates immediately available.
- Token placeholders (for contact/job/company values) are applied during export to personalize output without duplicating templates.

### How Export Is Accomplished

- For PDF export, the editor combines selected page HTML into a temporary document.
- It invokes `render-pdf.mjs` (Puppeteer + system Chromium) to print the HTML to a Letter-size PDF.
- It optionally invokes `pdf-add-alert.mjs` to embed JavaScript alert messaging inside the generated PDF.