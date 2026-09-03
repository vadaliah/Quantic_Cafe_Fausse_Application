-- Confirm required tables.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
      'customers',
      'reservations',
      'menu_categories',
      'menu_items'
  )
ORDER BY table_name;
-- Confirm columns and data types.
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
      'customers',
      'reservations',
      'menu_categories',
      'menu_items'
  )
ORDER BY table_name, ordinal_position;
-- Confirm constraints.
SELECT
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name IN (
      'customers',
      'reservations',
      'menu_categories',
      'menu_items'
  )
ORDER BY table_name, constraint_type, constraint_name;
-- Confirm triggers.
SELECT
    event_object_table AS table_name,
    trigger_name,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
-- Confirm required menu seed counts.
SELECT
    category_name,
    COUNT(menu_item_id) AS item_count
FROM menu_categories
LEFT JOIN menu_items USING (category_id)
GROUP BY category_id, category_name, menu_categories.display_order
ORDER BY menu_categories.display_order;