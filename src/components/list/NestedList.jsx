import { Fragment, useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const options = [
  {
    label: "Calendarios",
    icon: <CalendarMonthIcon />,
    value: "calendarios",
  },
  {
    label: "Recursos",
    icon: <DesktopWindowsIcon />,
    value: "recursos",
  },
  {
    label: "Time Table",
    icon: <EventNoteIcon />,
    value: "timeTable",
    children: [
      {
        label: "Mapas de calor",
        icon: <WhatshotIcon />,
        value: "mapasCalor",
      },
      {
        label: "Schedules",
        icon: <WatchLaterIcon />,
        value: "schedules",
      },
    ],
  },
];

export default function NestedList({ onSelect }) {
  const [open, setOpen] = useState({});
  const [selected, setSelected] = useState("calendarios");

  const handleToggle = (key) => {
    setOpen((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const handleSelect = (value) => {
    setSelected(value);
    if (onSelect) onSelect(value); // Comunica la opción seleccionada al componente padre
  };

  const renderOptions = (items, depth = 0) =>
    items.map((item) => (
      <Fragment key={item.value}>
        <ListItemButton
          sx={{ pl: depth * 4 }}
          selected={selected === item.value}
          onClick={
            item.children ? () => handleToggle(item.value) : () => handleSelect(item.value)
          }
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
          {item.children && (open[item.value] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {item.children && (
          <Collapse in={open[item.value]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderOptions(item.children, depth + 1)}
            </List>
          </Collapse>
        )}
      </Fragment>
    ));

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Opciones del monitor
        </ListSubheader>
      }
    >
      {renderOptions(options, 0.5)}
    </List>
  );
}
