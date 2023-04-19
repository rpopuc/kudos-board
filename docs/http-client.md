No linux:

```bash
sudo apt install httpie
```

Para rodar um GET:

```bash
http :80
```

Para rodar um POST:

```bash
http POST :80/panel
```

```bash
http --json POST :80/panel <<< `cat docs/panel.json`
```