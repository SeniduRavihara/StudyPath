import {
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
  Filter,
  Key,
  Link,
  RefreshCw,
  Search,
  Table,
  Type,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { SupabaseService } from "../lib/supabaseService";

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  foreign_table?: string;
  foreign_column?: string;
}

interface TableInfo {
  table_name: string;
  table_type: string;
  row_count: number;
  columns: ColumnInfo[];
  indexes: string[];
  constraints: string[];
}

interface RelationshipInfo {
  constraint_name: string;
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  constraint_type: string;
}

interface DatabaseStats {
  total_tables: number;
  total_columns: number;
  total_rows: number;
  total_indexes: number;
  total_constraints: number;
  database_size: string;
  last_updated: string;
}

const DatabaseOverview: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [relationships, setRelationships] = useState<RelationshipInfo[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "tables" | "columns" | "relationships"
  >("all");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  const loadDatabaseInfo = async () => {
    setLoading(true);
    try {
      console.log("🔍 Loading database info...");
      const [tablesData, relationshipsData, statsData] = await Promise.all([
        SupabaseService.getDatabaseTables(),
        SupabaseService.getDatabaseRelationships(),
        SupabaseService.getDatabaseStats(),
      ]);

      console.log("📊 Database data loaded:", {
        tables: tablesData?.length || 0,
        relationships: relationshipsData?.length || 0,
        stats: statsData?.[0] || null,
      });

      setTables(tablesData);
      setRelationships(relationshipsData);
      setStats(statsData?.[0] || null);
    } catch (error) {
      console.error("Error loading database info:", error);
      // Set default values if functions don't exist
      setTables([]);
      setRelationships([]);
      setStats({
        total_tables: 0,
        total_columns: 0,
        total_rows: 0,
        total_indexes: 0,
        total_constraints: 0,
        database_size: "0 MB",
        last_updated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTableExpansion = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getDataTypeColor = (dataType: string) => {
    const type = dataType.toLowerCase();
    if (type.includes("int") || type.includes("serial")) return "text-blue-400";
    if (
      type.includes("text") ||
      type.includes("varchar") ||
      type.includes("char")
    )
      return "text-green-400";
    if (type.includes("bool")) return "text-purple-400";
    if (type.includes("date") || type.includes("time"))
      return "text-orange-400";
    if (type.includes("json")) return "text-pink-400";
    if (type.includes("uuid")) return "text-cyan-400";
    return "text-gray-400";
  };

  const getConstraintIcon = (constraint: string | null) => {
    if (!constraint) return <Database className="w-4 h-4 text-gray-500" />;
    if (constraint.includes("PRIMARY KEY"))
      return <Key className="w-4 h-4 text-yellow-500" />;
    if (constraint.includes("FOREIGN KEY"))
      return <Link className="w-4 h-4 text-blue-500" />;
    if (constraint.includes("UNIQUE"))
      return <Type className="w-4 h-4 text-green-500" />;
    if (constraint.includes("CHECK"))
      return <Filter className="w-4 h-4 text-purple-500" />;
    return <Database className="w-4 h-4 text-gray-500" />;
  };

  const filteredTables = tables.filter(table => {
    if (searchTerm === "") return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      table.table_name.toLowerCase().includes(searchLower) ||
      table.columns.some(col =>
        col.column_name.toLowerCase().includes(searchLower),
      )
    );
  });

  const filteredRelationships = relationships.filter(rel => {
    if (searchTerm === "") return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      rel.table_name.toLowerCase().includes(searchLower) ||
      rel.foreign_table_name.toLowerCase().includes(searchLower) ||
      rel.column_name.toLowerCase().includes(searchLower) ||
      rel.foreign_column_name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Database Overview</h1>
          <p className="text-dark-400 mt-2">
            Complete database schema analysis and relationship mapping
          </p>
        </div>
        <button
          onClick={loadDatabaseInfo}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Database Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Table className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-dark-400 text-sm">Total Tables</p>
                <p className="text-white text-2xl font-bold">
                  {stats.total_tables}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-dark-400 text-sm">Total Columns</p>
                <p className="text-white text-2xl font-bold">
                  {stats.total_columns}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-dark-400 text-sm">Total Rows</p>
                <p className="text-white text-2xl font-bold">
                  {stats?.total_rows?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-dark-400 text-sm">Database Size</p>
                <p className="text-white text-2xl font-bold">
                  {stats.database_size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Message */}
      {stats && stats.total_tables === 0 && (
        <div className="card border-yellow-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Database Functions Not Found
              </h2>
              <p className="text-dark-400 text-sm">
                The database introspection functions need to be created first
              </p>
            </div>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Setup Required:</h3>
            <ol className="text-dark-300 text-sm space-y-1 list-decimal list-inside">
              <li>Go to your Supabase SQL Editor</li>
              <li>
                Run the migration file:{" "}
                <code className="bg-dark-800 px-2 py-1 rounded text-yellow-400">
                  scripts/migrations/03_database_introspection.sql
                </code>
              </li>
              <li>Refresh this page to see your database overview</li>
            </ol>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {stats && stats.total_tables > 0 && (
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tables, columns, or relationships..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="tables">Tables</option>
              <option value="columns">Columns</option>
              <option value="relationships">Relationships</option>
            </select>
          </div>
        </div>
      )}

      {/* Tables Overview */}
      {stats &&
        stats.total_tables > 0 &&
        (filterType === "all" || filterType === "tables") && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Table className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Database Tables
                </h2>
                <p className="text-dark-400 text-sm">
                  {filteredTables.length} tables found
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTables.map(table => (
                <div
                  key={table.table_name}
                  className="bg-dark-800 rounded-lg border border-dark-700"
                >
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-700 transition-colors"
                    onClick={() => toggleTableExpansion(table.table_name)}
                  >
                    <div className="flex items-center space-x-3">
                      {expandedTables.has(table.table_name) ? (
                        <ChevronDown className="w-5 h-5 text-dark-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-dark-400" />
                      )}
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Table className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {table.table_name}
                        </h3>
                        <p className="text-dark-400 text-sm">
                          {table.columns.length} columns •{" "}
                          {table.row_count.toLocaleString()} rows
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                        {table.table_type}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTable(table.table_name);
                        }}
                        className="text-dark-400 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {expandedTables.has(table.table_name) && (
                    <div className="border-t border-dark-700 p-4">
                      <div className="space-y-3">
                        {/* Columns */}
                        <div>
                          <h4 className="text-white font-medium mb-3">
                            Columns
                          </h4>
                          <div className="space-y-2">
                            {table.columns.map(column => (
                              <div
                                key={column.column_name}
                                className="flex items-center justify-between p-3 bg-dark-900 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  {column.is_primary_key && (
                                    <Key className="w-4 h-4 text-yellow-500" />
                                  )}
                                  {column.is_foreign_key && (
                                    <Link className="w-4 h-4 text-blue-500" />
                                  )}
                                  <span className="text-white font-medium">
                                    {column.column_name}
                                  </span>
                                  <span
                                    className={`text-sm ${getDataTypeColor(column.data_type)}`}
                                  >
                                    {column.data_type}
                                    {column.character_maximum_length &&
                                      `(${column.character_maximum_length})`}
                                  </span>
                                  {column.is_nullable === "NO" && (
                                    <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full">
                                      NOT NULL
                                    </span>
                                  )}
                                  {column.column_default && (
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                                      DEFAULT: {column.column_default}
                                    </span>
                                  )}
                                </div>
                                {column.foreign_table && (
                                  <div className="text-right">
                                    <p className="text-dark-400 text-sm">
                                      → {column.foreign_table}.
                                      {column.foreign_column}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Indexes */}
                        {table.indexes.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-3">
                              Indexes
                            </h4>
                            <div className="space-y-2">
                              {table.indexes.map((index, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-dark-900 rounded-lg"
                                >
                                  <span className="text-white font-mono text-sm">
                                    {index}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Constraints */}
                        {table.constraints.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-3">
                              Constraints
                            </h4>
                            <div className="space-y-2">
                              {table.constraints
                                .filter(
                                  constraint =>
                                    constraint !== null &&
                                    constraint !== undefined,
                                )
                                .map((constraint, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center space-x-3 p-3 bg-dark-900 rounded-lg"
                                  >
                                    {getConstraintIcon(constraint)}
                                    <span className="text-white font-mono text-sm">
                                      {constraint}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Relationships Overview */}
      {stats &&
        stats.total_tables > 0 &&
        (filterType === "all" || filterType === "relationships") && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Table Relationships
                </h2>
                <p className="text-dark-400 text-sm">
                  {filteredRelationships.length} relationships found
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRelationships.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-dark-800 rounded-lg border border-dark-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Table className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {rel.table_name}
                          </p>
                          <p className="text-dark-400 text-sm">
                            {rel.column_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 text-sm font-medium">
                          {rel.constraint_type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <Table className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {rel.foreign_table_name}
                          </p>
                          <p className="text-dark-400 text-sm">
                            {rel.foreign_column_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-dark-400 text-sm">
                        {rel.constraint_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Table Details Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Table className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedTable}
                  </h2>
                  <p className="text-dark-400">Table Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {(() => {
              const table = tables.find(t => t.table_name === selectedTable);
              if (!table) return null;

              return (
                <div className="space-y-6">
                  {/* Table Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-dark-800 rounded-lg">
                      <p className="text-dark-400 text-sm">Total Rows</p>
                      <p className="text-white text-2xl font-bold">
                        {table.row_count.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-dark-800 rounded-lg">
                      <p className="text-dark-400 text-sm">Total Columns</p>
                      <p className="text-white text-2xl font-bold">
                        {table.columns.length}
                      </p>
                    </div>
                    <div className="p-4 bg-dark-800 rounded-lg">
                      <p className="text-dark-400 text-sm">Table Type</p>
                      <p className="text-white text-2xl font-bold">
                        {table.table_type}
                      </p>
                    </div>
                  </div>

                  {/* Column Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Column Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-dark-700">
                            <th className="text-left text-white font-medium py-3">
                              Column
                            </th>
                            <th className="text-left text-white font-medium py-3">
                              Type
                            </th>
                            <th className="text-left text-white font-medium py-3">
                              Nullable
                            </th>
                            <th className="text-left text-white font-medium py-3">
                              Default
                            </th>
                            <th className="text-left text-white font-medium py-3">
                              Constraints
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map(column => (
                            <tr
                              key={column.column_name}
                              className="border-b border-dark-800"
                            >
                              <td className="py-3">
                                <div className="flex items-center space-x-2">
                                  {column.is_primary_key && (
                                    <Key className="w-4 h-4 text-yellow-500" />
                                  )}
                                  {column.is_foreign_key && (
                                    <Link className="w-4 h-4 text-blue-500" />
                                  )}
                                  <span className="text-white font-medium">
                                    {column.column_name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`${getDataTypeColor(column.data_type)}`}
                                >
                                  {column.data_type}
                                  {column.character_maximum_length &&
                                    `(${column.character_maximum_length})`}
                                </span>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    column.is_nullable === "YES"
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-red-500/10 text-red-500"
                                  }`}
                                >
                                  {column.is_nullable}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="text-dark-400 font-mono text-sm">
                                  {column.column_default || "—"}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex flex-wrap gap-1">
                                  {column.is_primary_key && (
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                                      PK
                                    </span>
                                  )}
                                  {column.is_foreign_key && (
                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                                      FK
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseOverview;
