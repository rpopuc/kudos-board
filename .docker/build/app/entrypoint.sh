#!/usr/bin/env bash
set -e

# Handler para SIGUSR1
my_handler() {
  echo "Handler para SIGUSR1 invocado"
}

# Handler para SIGTERM
term_handler() {
  echo "Handler para SIGTERM invocado"
  if [ $pid -ne 0 ]; then
    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  exit 143; # Código de saída para SIGTERM (128 + 15)
}

trap my_handler SIGUSR1
trap term_handler SIGTERM

pid=0
# Verifica se um comando foi fornecido
if [ -z "$1" ]; then
  # Fallback se nenhum comando for especificado
  tail -f /dev/null &
  pid=$!
else
  "$@" &
  pid=$!
fi

wait $pid
pid=0

exit_code=$?
echo "Processo terminou com código de saída: $exit_code"
exit $exit_code
