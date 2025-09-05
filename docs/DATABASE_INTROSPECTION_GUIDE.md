# Database Introspection Guide

## Overview

The Database Overview page provides a comprehensive view of your Supabase database schema, including all tables, columns, relationships, constraints, and statistics. This is a powerful tool for database administrators and developers to understand the complete structure of their database.

## Features

### 📊 Database Statistics

- Total number of tables, columns, and rows
- Database size information
- Index and constraint counts
- Last updated timestamp

### 🗂️ Table Information

- Complete table listing with row counts
- Detailed column information including:
  - Data types with color coding
  - Nullable constraints
  - Default values
  - Primary and foreign key indicators
  - Character length limits

### 🔗 Relationship Mapping

- Foreign key relationships between tables
- Primary key constraints
- Unique constraints
- Visual relationship indicators

### 🔍 Advanced Search & Filtering

- Search across table names, column names, and relationships
- Filter by tables, columns, or relationships
- Real-time search results

### 📋 Detailed Table Views

- Expandable table sections
- Column details with constraint information
- Index listings
- Constraint definitions
- Modal popup for detailed table analysis

## Setup Instructions

### 1. Run the Database Introspection Migration

Execute the migration file to create the necessary PostgreSQL functions:

```sql
-- Run this in your Supabase SQL editor
\i scripts/migrations/03_database_introspection.sql
```

### 2. Verify Function Creation

Check that the functions were created successfully:

```sql
-- List all functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'get_database_%';
```

### 3. Test the Functions

Test each function to ensure they work correctly:

```sql
-- Test database tables function
SELECT * FROM get_database_tables() LIMIT 1;

-- Test relationships function
SELECT * FROM get_database_relationships() LIMIT 5;

-- Test statistics function
SELECT * FROM get_database_stats();
```

## Function Details

### `get_database_tables()`

Returns comprehensive information about all tables in the public schema:

- **table_name**: Name of the table
- **table_type**: Type of table (BASE TABLE)
- **row_count**: Number of rows in the table
- **columns**: JSONB array of column information
- **indexes**: Array of index definitions
- **constraints**: Array of constraint definitions

### `get_database_relationships()`

Returns all foreign key relationships and constraints:

- **constraint_name**: Name of the constraint
- **table_name**: Source table
- **column_name**: Source column
- **foreign_table_name**: Referenced table
- **foreign_column_name**: Referenced column
- **constraint_type**: Type of constraint (FOREIGN KEY, PRIMARY KEY, UNIQUE)

### `get_database_stats()`

Returns overall database statistics:

- **total_tables**: Count of all tables
- **total_columns**: Count of all columns
- **total_rows**: Sum of rows across all tables
- **total_indexes**: Count of all indexes
- **total_constraints**: Count of all constraints
- **database_size**: Human-readable database size
- **last_updated**: Timestamp of when stats were calculated

## Security Considerations

### Row Level Security (RLS)

The functions are created with `SECURITY DEFINER`, which means they run with the privileges of the function owner (typically the database owner). This allows them to access system catalogs and information schema views.

### Permissions

The functions are granted `EXECUTE` permission to the `authenticated` role, which means any authenticated user can call these functions. In a production environment, you might want to restrict this to admin users only.

### Data Exposure

These functions expose detailed schema information. While this is generally safe for internal admin tools, be aware that they reveal:

- Table structures
- Column names and types
- Relationship mappings
- Constraint definitions

## Usage in the Admin Panel

### Navigation

The Database Overview is accessible from:

- Main navigation sidebar: "Database"
- Dashboard quick actions: "View Database"

### Features Available

1. **Real-time Refresh**: Click the refresh button to get the latest database information
2. **Search Functionality**: Search across all database elements
3. **Filter Options**: Filter by tables, columns, or relationships
4. **Expandable Tables**: Click on any table to see detailed column information
5. **Modal Details**: Click the eye icon for a detailed table view
6. **Relationship Visualization**: See how tables are connected

### Performance Considerations

- The functions query system catalogs and may be slow on very large databases
- Row counts are calculated by running `COUNT(*)` on each table
- Consider adding indexes on frequently queried system catalog columns if performance becomes an issue

## Troubleshooting

### Common Issues

1. **Function Not Found Error**
   - Ensure the migration was run successfully
   - Check that functions exist in the public schema
   - Verify user has EXECUTE permissions

2. **Permission Denied**
   - Ensure the user is authenticated
   - Check that the `authenticated` role has EXECUTE permissions on the functions

3. **Empty Results**
   - Verify that tables exist in the public schema
   - Check that the functions are returning data correctly
   - Ensure the database has the expected structure

### Debug Queries

```sql
-- Check if functions exist
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name LIKE 'get_database_%';

-- Test with a simple query
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check permissions
SELECT has_function_privilege('authenticated', 'get_database_tables()', 'EXECUTE');
```

## Future Enhancements

Potential improvements for the Database Overview:

1. **Visual Schema Diagram**: Add a visual representation of table relationships
2. **Query Builder**: Allow users to build and execute queries
3. **Performance Metrics**: Show query performance and table statistics
4. **Export Functionality**: Export schema information to various formats
5. **Real-time Monitoring**: Live updates of database changes
6. **Index Recommendations**: Suggest missing indexes based on query patterns

## Support

If you encounter any issues with the Database Overview functionality:

1. Check the browser console for JavaScript errors
2. Verify the Supabase functions are working correctly
3. Ensure proper authentication and permissions
4. Review the migration file for any syntax errors

The Database Overview provides a powerful way to understand and manage your database schema, making it easier to maintain and optimize your StudyPath application.
