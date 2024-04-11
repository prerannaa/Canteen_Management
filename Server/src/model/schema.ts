import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  serial,
  decimal,
  primaryKey,
  uuid,
  json
} from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  birthdate: varchar("birthdate", { length: 256 }),
  password: text("password"),
  role: text("role"),
  createdAt: timestamp("created_at"),
});

export const adminsRelations = relations(admin, ({ many }) => ({
  users: many(users),
  categories: many(categories),
  items: many(items),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),  
  birthdate: varchar("birthdate", { length: 256 }),
  password: text("password"),
  balance: decimal("balance"),
  role: text("role"),
  createdBy: integer("created_by").references(() => admin.id),
  createdAt: timestamp("created_at"),
});

export const usersRelations = relations(users, ({ one }) => ({
  userAccount: one(admin, {
    fields: [users.createdBy],
    references: [admin.id],
  })
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name"),
  addedById: integer("added_by")
    .notNull()
    .references(() => admin.id),
  createdAt: timestamp("created_at"),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  addedBy: one(admin, {
    fields: [categories.addedById],
    references: [admin.id],
  }),
  categoryType: many(items),
}));

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name"),
  image_url: text("image"),
  price: integer("price"),
  categoryType: text("category"),
  ingredients: json('ingredient').default({}),
  addedById: integer("added_by")
    .notNull()
    .references(() => admin.id),
  createdAt: timestamp("created_at"),
});

export const itemsRelations = relations(items, ({ one,many }) => ({
  addedBy: one(admin, {
    fields: [items.addedById],
    references: [admin.id],
  }),
  order: many(orders),
  inventoryItem: many(itemsOnInventory)
}));

  export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {onDelete: "set null"}),
    itemId: integer("item_id").references(() => items.id),
    quantity: integer("quantity"),
    totalPrice: integer("total_price"),
    remarks: text("remarks"),
    createdAt:timestamp("created_at")
  })


  export const ordersRelation = relations(orders, ({ one}) => ({
    userOrder: one(users, {
      fields: [orders.userId],
      references: [users.id]
    }),
    orderedItem: one(items,{
      fields: [orders.itemId],
      references: [items.id]
    })
  }));

  export const inventory = pgTable("inventory", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    price: decimal("price").notNull(),
    quantity: integer("quantity").notNull(),    
    createdAt: timestamp("created_at")
  })

  export const inventoryRelation = relations( inventory, ({many}) => ({
    item: many(itemsOnInventory)
  }))

  export const itemsOnInventory = pgTable("items_inventory", {
    itemId: integer("item_id").notNull().references(() => items.id),
    inventoryId: integer("inventory_id").notNull().references(() => inventory.id),
    ingredientName: text("ingredient_name").notNull(), // New column for ingredient name
    createdAt: timestamp("created_at")
  },
  (t) => ({
    pk: primaryKey({ columns : [t.itemId, t.inventoryId]}),
  }))


  export const itemsOnInventoryRelation = relations(itemsOnInventory, ({one}) => ({
    item : one(items, {
      fields: [itemsOnInventory.itemId],
      references: [items.id]
    }),
    ingredients: one(inventory, {
      fields: [itemsOnInventory.inventoryId],
      references: [inventory.id]
    })
  }))
