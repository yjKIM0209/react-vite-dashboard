import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import type { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CommonGridProps<TData = any> {
  rowData: TData[] | null;
  columnDefs: ColDef<TData>[];
  isLoading?: boolean;
  gridOptions?: GridOptions<TData>;
  showSelection?: boolean;
  onGridReady?: (event: GridReadyEvent<TData>) => void;
  onRowClick?: (data: TData) => void;
}

const CommonGrid = <TData,>({
  rowData,
  columnDefs,
  isLoading = false,
  gridOptions,
  showSelection = false,
  onGridReady,
  onRowClick,
}: CommonGridProps<TData>) => {
  
  const defaultColDef = useMemo<ColDef<TData>>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    suppressHeaderMenuButton: false, 
    ...gridOptions?.defaultColDef, 
  }), [gridOptions]);

  return (
    <div className="ag-theme-quartz w-full h-full">
      <AgGridReact<TData>
        theme={themeQuartz}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        loading={isLoading}
        animateRows={true}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 50, 100]}
        rowSelection={showSelection ? { mode: 'multiRow', headerCheckbox: true } : undefined}
        onGridReady={onGridReady}
        onRowClicked={(e) => onRowClick?.(e.data as TData)}
        {...gridOptions}
      />
    </div>
  );
};

export default CommonGrid;