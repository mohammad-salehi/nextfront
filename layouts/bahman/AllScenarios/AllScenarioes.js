import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Card } from "reactstrap";
import TaskTabel from "./TaskTable/TaskTable";
const AllScenarioes = () => {
  const [valueTab, setValueTab] = useState("1");
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const [History, SetHistory] = useState([])
  const [SchedulerList, SetSchedulerList] = useState([])

  return (
    <Card className="card" style={{}}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#2fa3dd" },
              "& .MuiTab-root.Mui-selected": { color: "#2fa3dd" },
            }}
          >
            <Tab label="تاریخچه سناریوها" value="1" />
            <Tab label="سناریوهای زمانبندی شده" value="2" />
            <Tab label="آمار معاملات" value="3" />
          </Tabs>
        </Box>
        <TabPanel value="1" className="p-0 m-0">
          <TaskTabel  History={History} SetHistory={SetHistory} />
        </TabPanel>
        <TabPanel value="2" className="p-0 m-0">
          2
        </TabPanel>
        <TabPanel value="3" className="p-0 m-0">
          3
        </TabPanel>
      </TabContext>
    </Card>
  );
};

export default AllScenarioes;
