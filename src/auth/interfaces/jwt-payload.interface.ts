export interface JWTPayload {
  id: string;
  jti?: `${string}-${string}-${string}-${string}-${string}`;
  type: 'access' | 'refresh';
}
