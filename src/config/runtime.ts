export function envFlag(name: string, defaultValue = false) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function publicEnv(name: string, fallback: string) {
  return process.env[name]?.trim() || fallback;
}
