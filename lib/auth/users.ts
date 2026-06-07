import bcrypt from "bcryptjs";

export type NotificationKey =
  | "order_updates"
  | "newsletter"
  | "sms_order_updates";

export type NotificationPreferences = Record<NotificationKey, boolean>;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  order_updates: true,
  newsletter: false,
  sms_order_updates: false,
};

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  notificationPreferences: NotificationPreferences;
}

const users: StoredUser[] = [];

function seedDemoUser(): void {
  if (users.find((u) => u.email === "demo@maison.com")) return;
  users.push({
    id: "usr_demo_001",
    email: "demo@maison.com",
    name: "Alex Morgan",
    passwordHash: bcrypt.hashSync("maison123", 10),
    createdAt: new Date("2025-01-15T10:00:00Z"),
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
  });
  users.push({
    id: "usr_demo_002",
    email: "sophia@example.com",
    name: "Sophia Reyes",
    passwordHash: bcrypt.hashSync("maison123", 10),
    createdAt: new Date("2025-03-22T14:30:00Z"),
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
  });
}

seedDemoUser();

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

export function findUserById(id: string): StoredUser | undefined {
  return users.find((u) => u.id === id);
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface CreateUserResult {
  ok: boolean;
  user?: StoredUser;
  error?: "email_exists" | "invalid_input";
}

export function createUser(input: CreateUserInput): CreateUserResult {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name || !input.password) {
    return { ok: false, error: "invalid_input" };
  }
  if (findUserByEmail(email)) {
    return { ok: false, error: "email_exists" };
  }
  const user: StoredUser = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    email,
    name,
    passwordHash: bcrypt.hashSync(input.password, 10),
    createdAt: new Date(),
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
  };
  users.push(user);
  return { ok: true, user };
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function getAllUsers(): StoredUser[] {
  return [...users];
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export function updateUser(
  id: string,
  patch: UpdateUserInput
): StoredUser | undefined {
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return undefined;
  const current = users[idx];
  const next: StoredUser = {
    ...current,
    name: patch.name?.trim() || current.name,
    email: patch.email?.trim().toLowerCase() || current.email,
  };
  users[idx] = next;
  return next;
}

export function getNotificationPreferences(
  id: string
): NotificationPreferences {
  const user = findUserById(id);
  if (!user) return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...user.notificationPreferences };
}

export function updateNotificationPreferences(
  id: string,
  patch: Partial<NotificationPreferences>
): NotificationPreferences | undefined {
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return undefined;
  const current = users[idx];
  const merged: NotificationPreferences = {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...current.notificationPreferences,
    ...patch,
  };
  users[idx] = { ...current, notificationPreferences: merged };
  return merged;
}
