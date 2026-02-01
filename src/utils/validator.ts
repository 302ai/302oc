/**
 * 输入验证工具
 */

export function validateApiKey(input: string): boolean | string {
  const trimmed = input.trim();

  if (!trimmed) {
    return 'API Key 不能为空';
  }

  if (trimmed.length < 20) {
    return 'API Key 长度不足（至少需要 20 个字符）';
  }

  if (!/^[\w\-]+$/.test(trimmed)) {
    return 'API Key 包含非法字符（只允许字母、数字、横线和下划线）';
  }

  return true;
}

export function validateBaseUrl(input: string): boolean | string {
  const trimmed = input.trim();

  if (!trimmed) {
    return 'Base URL 不能为空';
  }

  try {
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Base URL 必须使用 http 或 https 协议';
    }
    return true;
  } catch {
    return 'Base URL 格式无效';
  }
}

export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 10) {
    return '*'.repeat(apiKey.length);
  }

  return `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`;
}

export function validateProfileName(input: string): boolean | string {
  const trimmed = input.trim();

  if (!trimmed) {
    return '配置名称不能为空';
  }

  if (trimmed.length > 50) {
    return '配置名称不能超过 50 个字符';
  }

  return true;
}
