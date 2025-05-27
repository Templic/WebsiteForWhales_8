# Documentation Versionin

g

**Version:** 1.0 **Last Updated:** 2025-05-17 **Status:** Active **AI-Index:** the versioning system for documentation, detailing how version numbers are assigned, tracked, and maintained throughout the documentation lifecycle. It explains the semantic versioning approach used for documentation, version tagging mechanisms, and how documentation versions align with software releases. The document provides guidelines for managing documentation across multiple versions, handling version-specific content, and implementing version control in documentation workflows.

## Overview Versioning is a critical component of documentation management that ensures users can access the appropriate documentation for their specific version of the software. our approach to version control for documentatio

n.

## Versioning Approach Our documentation follows a semantic versioning approach similar to software: ### Document Version Numbers Individual documents use a simple MAJOR.MINOR versioning scheme: - **MAJOR** version - Incremented for significant content changes that alter the meaning or structur

e

- **MINOR** version - Incremented for minor updates, corrections, or additions that don't change core content Example: Document version 2.3 ### Documentation Set Versions The complete documentation set version aligns with the software version it documents: - Documentation version matches the software version (e.g., v3.2.

1)
- Point releases may have documentation updates (e.g., v3.2.1-docs.2)

## Version Control Integration ### Git-Based Workflow Documentation is versioned using Git with the following practices: 1. **Branch Strategy** - `main` branch contains documentation for the latest release - `dev` branch contains documentation for the upcoming release - Version-specific branches (e.g., `docs-v2.1.x`) for maintaining older versions 2. **Commit Conventions** - Commit messages follow the format: `docs: [scope] description` - Example: `docs: [api] update authentication examples` - Version bumps are explicitly noted: `docs: bump user guide to v2.1` 3. **Tagging Strategy** - Documentation releases are tagged: `docs-v2.1.0` - Combined software/docs releases: `v2.1.0` ### Version History Tracking Each document maintains a version history tabl

e:

```markdown

## Version Histor

y

| Version | Date | Changes |

|---------|------|---------|
| 1.1 | 2025-05-10 | Added section on OAuth authentication |

| 1.0 | 2025-05-01 | Initial document |
```

## Version Management Workflow ### Updating Document Versions When updating a document: 1. Assess the nature of the change: - Minor correction or clarification → increment MINOR version - Substantial content change → increment MAJOR version - Complete rewrite → set to version 1.0 2. Update the document metadat

a:

```markdown

 **Version:** 2.1
 **Last Updated:** 2025-05-17


``` 3. Add an entry to the version history table ### Automated Version Management Version management is partially automated: 1. **Pre-commit Hook** - Validates version number and last updated date are change

d

2. **Documentation Build** - Generates version history from Git commits

3. **Version Consistency Check** - Ensures version numbers follow conventions

## Multi-Version Documentation Our documentation system supports maintaining multiple versions simultaneously: ### Version Selector The documentation portal includes a version selector allowing users t

o:

- View the latest documentation
- View documentation for a specific version
- Compare changes between versions ### Version-Specific Content For content that varies between versions: 1. **Version Tab

s**

```markdown
 === "Version 3.x"


```javascript // New API format client.connect({ authType: "oauth2", credentials: token });

```


 === "Version 2.x"


```javascript // Legacy API format client.connect(token, { authType: "oauth2" });

```



``` 2. **Version Notices**

```markdown
 > [!NOTE]
 > This feature is available in version 3.2 and later.


``` 3. **Version-Specific Pages** When content differs , separate pages are maintained: - `feature-v3.md` - `feature-v2.md`

## Version Mapping Documentation versions are mapped to software versions: | Software Version | Documentation Version | Support Status | URL Pat

h |

|------------------|------------------------|---------------|----------|

| 3.x | 3.0 - 3.2 | Current | /docs/v3/ |
| 2.x | 2.0 - 2.5 | Maintenance | /docs/v2/ |

| 1.x | 1.0 - 1.8 | Legacy | /docs/v1/ |

## Implementation Examples ### Version Configuratio

n

```json

{
 "versions": {
 "latest": "3.2",
 "current": ["3.0", "3.1", "3.2"],
 "maintenance": ["2.4", "2.5"],
 "legacy": ["1.7", "1.8"]
 },
 "versionAliases": {
 "latest": "3.2",
 "stable": "3.1",
 "lts": "2.5"
 }
}
``` ### Git Workflow Command

s

```bash
# Create a branch for documentation update

s

git checkout -b docs/update-auth-examples

# Make changes to documentation file

s

# Commit changes with proper forma

t

git commit -m "docs: [auth] update OAuth examples for v3.2"

# Create a documentation version ta

g

git tag docs-v3.2.1

# Push changes and ta

g

git push origin docs/update-auth-examples

git push origin docs-v3.2.1
```

## Best Practices 1. **Be Consistent** - Follow version numbering convention

s

2. **Document Breaking Changes** - Clearly indicate when documentation covers breaking changes

3. **Maintain Older Versions** - Keep documentation for supported older versions

4. **Use Version Control** - Leverage Git features for documentation versioning

5. **Automate When Possible** - Automate version updates and checks

6. **Link Between Versions** - Provide links to equivalent content in other versions

## Related Documents - [Documentation Lifecycle](./README.m

d)

- [Creation Process](./creation.md)
- [Maintenance Guidelines](./maintenance.md)
- [Archiving Procedures](./archiving.md)
- [Continuous Documentation](../continuous-documentation/README.md)

## Version History | Version | Date | Change

s |

|---------|------|---------|

| 1.0 | 2025-05-17 | Initial document |