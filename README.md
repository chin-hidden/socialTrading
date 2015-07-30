# `Social Trading`

## Dependency

- PostgreSQL 9.x
- Redis
- Python development headers (to compile the py-psycopg native extension)

Install Python requirements

```
pip install -r requirements.txt
```

## Run

Run a `redis-server`, then:

```
make launch
```

## Testing

```
make test
```
