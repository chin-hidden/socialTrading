# `Social Trading`

## Dependency

- Python > 3.2
- PostgreSQL 9.x
- Redis

Install Python requirements

```
pip install -r requirements.txt
```

## Run

Run a `redis-server`, then:

```
make launch
```

In production, copy `socialtrading/default_configs.py` to `production_configs.py`, change the necessary config keys and run:

```
make launch-production
```

## Testing

```
make test
```
