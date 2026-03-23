import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CommonGridProps<TData = any> {
  rowData: TData[] | null;
  columnDefs: ColDef<TData>[];
  isLoading?: boolean;
  gridOptions?: GridOptions<TData>;
  showSelection?: boolean;
}

const CommonGrid = <TData,>({
  rowData,
  columnDefs,
  isLoading = false,
  gridOptions,
  showSelection = false,
}: CommonGridProps<TData>) => {
  
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
    ...gridOptions?.defaultColDef, 
  }), [gridOptions]);

  const selectionColumnDef = useMemo(() => {
    if (!showSelection) return undefined;
    return {
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      pinned: 'left' as const,
      ...gridOptions?.selectionColumnDef,
    };
  }, [showSelection, gridOptions]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        theme={themeQuartz}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        loading={isLoading}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 50, 100]}
        selectionColumnDef={selectionColumnDef}
        rowSelection={showSelection ? { mode: 'multiRow', headerCheckbox: true } : undefined}
        {...gridOptions}
      />
    </div>
  );
};

export default CommonGrid;