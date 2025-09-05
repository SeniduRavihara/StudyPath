-- Database Introspection Functions
-- These functions provide comprehensive database schema information

-- Function to get all database tables with detailed information
CREATE OR REPLACE FUNCTION get_database_tables()
RETURNS TABLE (
  table_name text,
  table_type text,
  row_count bigint,
  columns jsonb,
  indexes text[],
  constraints text[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_record RECORD;
  column_record RECORD;
  index_record RECORD;
  constraint_record RECORD;
  columns_json jsonb;
  indexes_array text[];
  constraints_array text[];
BEGIN
  -- Loop through all tables in the public schema
  FOR table_record IN 
    SELECT 
      t.table_name::text,
      t.table_type::text
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name
  LOOP
    -- Get row count for the table
    EXECUTE format('SELECT COUNT(*) FROM %I', table_record.table_name) INTO row_count;
    
    -- Get columns information
    columns_json := '[]'::jsonb;
    FOR column_record IN
      SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text,
        c.column_default::text,
        c.character_maximum_length,
        CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key,
        CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END as is_foreign_key,
        fk.foreign_table_name::text,
        fk.foreign_column_name::text
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT ku.column_name::text
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
        WHERE tc.table_name = table_record.table_name
        AND tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
      ) pk ON c.column_name = pk.column_name
      LEFT JOIN (
        SELECT 
          ku.column_name::text,
          ccu.table_name::text AS foreign_table_name,
          ccu.column_name::text AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = table_record.table_name
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ) fk ON c.column_name = fk.column_name
      WHERE c.table_name = table_record.table_name
      AND c.table_schema = 'public'
      ORDER BY c.ordinal_position
    LOOP
      columns_json := columns_json || jsonb_build_object(
        'column_name', column_record.column_name,
        'data_type', column_record.data_type,
        'is_nullable', column_record.is_nullable,
        'column_default', column_record.column_default,
        'character_maximum_length', column_record.character_maximum_length,
        'is_primary_key', column_record.is_primary_key,
        'is_foreign_key', column_record.is_foreign_key,
        'foreign_table', column_record.foreign_table_name,
        'foreign_column', column_record.foreign_column_name
      );
    END LOOP;
    
    -- Get indexes information
    indexes_array := ARRAY[]::text[];
    FOR index_record IN
      SELECT 
        i.indexname::text as index_name,
        i.indexdef::text as index_definition
      FROM pg_indexes i
      WHERE i.tablename = table_record.table_name
      AND i.schemaname = 'public'
      ORDER BY i.indexname
    LOOP
      indexes_array := array_append(indexes_array, index_record.index_definition);
    END LOOP;
    
    -- Get constraints information
    constraints_array := ARRAY[]::text[];
    FOR constraint_record IN
      SELECT 
        tc.constraint_name::text,
        tc.constraint_type::text,
        CASE 
          WHEN tc.constraint_type = 'CHECK' THEN cc.check_clause::text
          WHEN tc.constraint_type = 'UNIQUE' THEN 
            'UNIQUE (' || string_agg(ku.column_name::text, ', ' ORDER BY ku.ordinal_position) || ')'
          WHEN tc.constraint_type = 'FOREIGN KEY' THEN 
            'FOREIGN KEY (' || ku.column_name::text || ') REFERENCES ' || 
            ccu.table_name::text || '(' || ccu.column_name::text || ')'
          ELSE tc.constraint_type::text
        END as constraint_definition
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
      LEFT JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_name = table_record.table_name
      AND tc.table_schema = 'public'
      AND tc.constraint_type != 'PRIMARY KEY' -- Primary keys are handled in columns
      GROUP BY tc.constraint_name, tc.constraint_type, cc.check_clause, ccu.table_name, ccu.column_name, ku.column_name
      ORDER BY tc.constraint_name
    LOOP
      constraints_array := array_append(constraints_array, 
        constraint_record.constraint_name || ': ' || constraint_record.constraint_definition
      );
    END LOOP;
    
    -- Return the table information
    table_name := table_record.table_name;
    table_type := table_record.table_type;
    columns := columns_json;
    indexes := indexes_array;
    constraints := constraints_array;
    
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Function to get all database relationships
CREATE OR REPLACE FUNCTION get_database_relationships()
RETURNS TABLE (
  constraint_name text,
  table_name text,
  column_name text,
  foreign_table_name text,
  foreign_column_name text,
  constraint_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.constraint_name::text,
    tc.table_name::text,
    ku.column_name::text,
    ccu.table_name::text as foreign_table_name,
    ccu.column_name::text as foreign_column_name,
    tc.constraint_type::text
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
  JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
  WHERE tc.table_schema = 'public'
  AND tc.constraint_type IN ('FOREIGN KEY', 'PRIMARY KEY', 'UNIQUE')
  ORDER BY tc.table_name, tc.constraint_name;
END;
$$;

-- Function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE (
  total_tables bigint,
  total_columns bigint,
  total_rows bigint,
  total_indexes bigint,
  total_constraints bigint,
  database_size text,
  last_updated timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_record RECORD;
  row_count bigint := 0;
  total_tables_count bigint;
  total_columns_count bigint;
  total_rows_count bigint := 0;
  total_indexes_count bigint;
  total_constraints_count bigint;
  db_size text;
BEGIN
  -- Count total tables
  SELECT COUNT(*) INTO total_tables_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  -- Count total columns
  SELECT COUNT(*) INTO total_columns_count
  FROM information_schema.columns
  WHERE table_schema = 'public';
  
  -- Count total rows across all tables
  FOR table_record IN 
    SELECT table_name::text
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I', table_record.table_name) INTO row_count;
    total_rows_count := total_rows_count + row_count;
  END LOOP;
  
  -- Count total indexes
  SELECT COUNT(*) INTO total_indexes_count
  FROM pg_indexes
  WHERE schemaname = 'public';
  
  -- Count total constraints
  SELECT COUNT(*) INTO total_constraints_count
  FROM information_schema.table_constraints
  WHERE table_schema = 'public';
  
  -- Get database size
  SELECT pg_size_pretty(pg_database_size(current_database())) INTO db_size;
  
  -- Return the statistics
  total_tables := total_tables_count;
  total_columns := total_columns_count;
  total_rows := total_rows_count;
  total_indexes := total_indexes_count;
  total_constraints := total_constraints_count;
  database_size := db_size;
  last_updated := NOW();
  
  RETURN NEXT;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_database_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_database_relationships() TO authenticated;
GRANT EXECUTE ON FUNCTION get_database_stats() TO authenticated;
