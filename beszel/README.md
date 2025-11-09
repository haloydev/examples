# Deploying Beszel with Haloy

this is an example on how you can use haloy to deploy [Beszel](https://beszel.dev/) to multiple servers.

```bash
# deploy dashboard
haloy deploy -c beszel.yaml

# deploy all agents
haloy deploy -c beszel-agent.yaml -a

# deploy specific target
haloy deploy -c beszel-agent.yaml -t hermes
```
