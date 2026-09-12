# Cloud Vision to Firestore

A JavaScript event handler that analyzes an image from Cloud Storage and conditionally writes labels and dominant color to Firestore.

## Scope

The implemented request uses label detection, image properties and SafeSearch. It does not implement OCR or identity verification despite the document-oriented collection name. Deployment configuration and an end-to-end test are not included.

## Technology / Material

Node.js · Cloud Vision · Cloud Storage · Firestore

## Repository guide

- [index.js](index.js)
- [package.json](package.json)

## Getting started / Reproducibility

Inspect the exported `dniemieAnalysis` handler. Reproduction requires compatible SDKs, your own cloud resources and an event with bucket/name fields; the repository alone is not a deployable service.

## Author

**Christian Vladimir Sucuzhanay Arévalo**

Data & AI Solutions Architect | AWS Data Architecture | Generative AI & Amazon Bedrock | Big Data | Former University Lecturer

[Entity Home](https://christiansucuzhanay.com/) · [Technical Portfolio](https://sukuzhanay.github.io/) · [LinkedIn](https://www.linkedin.com/in/sucuzhanay) · [AWS Builder](https://builder.aws.com/community/@sucuzhanay) · [GitHub](https://github.com/sukuzhanay)

**Build. Explain. Teach. Share.**
