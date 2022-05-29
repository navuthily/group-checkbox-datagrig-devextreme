import React, { useState, useEffect} from "react";
import CheckBox from "devextreme-react/check-box";
import DataGrid, {
  Column,Scrolling,
  Selection,
  FilterRow,
  Paging
} from "devextreme-react/data-grid";
import { SelectBox } from "devextreme-react";
import { sales } from "./employees.js";
import GroupTemplate from "./GroupTemplate.js";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
const getKeys = function (
  data,
  keys,
  groupedColumnName,
  groupKey,
  keyFieldName,
  columnIndex,
  values
) {
  const groupRow = data?.find((i) => {
    return i.key === groupKey;
  });
  if (groupRow) {
    const itemsGr2 = groupRow?.items.map((item, index) => {
      return item.items;
    });
    const itemsGr2Flat = itemsGr2?.flat();
    let result = itemsGr2Flat?.map((a) => a.id);
    return result;
  } else {
    const groupRow2 = data?.find((i) => {
      return i.key === values[0];
    });
    const itemsGr2Flat = groupRow2?.items?.flat();
    const a = itemsGr2Flat?.find((i) => {
      return i.key === groupKey;
    });

    let result = a?.items?.map((a) => a.id);
    return result;
  }
};
const checkIfKeysAreSelected = function (currentKeys, selectedKeys) {
  let count = 0;

  if (selectedKeys.length === 0) return false;
  for (var i = 0; i < currentKeys?.length; i++) {
    var keyValue = currentKeys[i];
    if (selectedKeys.indexOf(keyValue) > -1)
      // key is not selected
      count++;
  }
  if (count === 0) return false;
  if (currentKeys.length === count) return true;
  else return undefined;
};
const getGroupText = (
  column,
  text,
  groupContinuesMessage,
  groupContinuedMessage
) => {
  let groupText = "";
  groupText = column.caption + ": " + text;
  if (groupContinuedMessage && groupContinuesMessage) {
    groupText +=
      " (" + groupContinuedMessage + ". " + groupContinuesMessage + ")";
  } else if (groupContinuesMessage) {
    groupText += " (" + groupContinuesMessage + ")";
  } else if (groupContinuedMessage) {
    groupText += " (" + groupContinuedMessage + ")";
  }
  return groupText;
};
function App() {
  const [sa, setSale] = useState([]);

  const [groupedData, setgroupedData] = useState([]);
  const keyExpr = "id";
  const onSelectionChanged = (args) => {
    let keys = groupedData.slice();
    setgroupedData(keys);
  };

  useEffect(()=>{
    setSale(sales)
  },[])
  const renderer = (props) => {
    let {
      column,
      value,
      groupContinuedMessage,
      groupContinuesMessage,
      text,
      component,
      data,
      columnIndex,
      values,
    } = props;
    let keys = getKeys(
      groupedData,
      [],
      column.dataField,
      value,
      keyExpr,
      columnIndex,
      values
    );
    let checked = checkIfKeysAreSelected(keys, component.getSelectedRowKeys());
    let groupText = getGroupText(
      column,
      text,
      groupContinuesMessage,
      groupContinuedMessage
    );
    // const c=data?.items ?? data?.collapsedItems;
    props = {
      checked: checked,
      groupText: groupText,
      onValueChanged: (args) => {
        onValueChanged(args, component, keys);
      },
    };
    return (
      <>
        <CheckBox value={props.checked} onValueChanged={props.onValueChanged} />
        <span style={{ marginLeft: "5px" }}> {props.groupText} </span>
      </>
    );
  };

  const onValueChanged = (args, grid, keys) => {
    if (!args.event) return;
    if (args.value) grid.selectRows(keys, true);
    else grid.deselectRows(keys);
  };
  const onContentReady = (args) => {
    if (args.component.isNotFirstLoad) return;
    args.component.isNotFirstLoad = true;
    let ds = args.component.getDataSource();
    ds.store()
      .load(ds.loadOptions())
      .done((r) => {
        console.log(r,'r nè')
        setgroupedData(r);
      });
  };
  return (
    <div>
      <DataGrid
        dataSource={sa}
        showBorders={true}
        keyExpr={keyExpr}
        onSelectionChanged={onSelectionChanged}
        onContentReady={onContentReady}
      >
        <Selection mode={"multiple"} />
        <FilterRow visible={true} />
        {/* <Paging defaultPageSize={10} /> */}
        <Column dataField={"id"} caption={"Order ID"} width={90} />
        <Column dataField={"city"} groupIndex={1}  groupCellRender={renderer}/>
        <Column
          groupIndex={0}
          groupCellRender={renderer}
          dataField={"country"}
          width={180}
        />
        <Column dataField={"region"}  
        />
        <Column dataField={"date"} dataType={"date"} />
        <Column dataField={"amount"} format={"currency"} width={90} />
        <Scrolling mode="virtual" />
      </DataGrid>
    </div>
  );
}

export default App;
