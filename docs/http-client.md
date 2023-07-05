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
http POST :8080/panel user-id:user-id --json <<< `cat docs/panel.json`
```
