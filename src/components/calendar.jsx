/* eslint-disable no-restricted-globals */
import React from 'react';
import styled from 'styled-components';
import useLocalStorage from '../hooks/useLocalStorage';
import { useState, useMemo } from 'react';
import { useEffect } from 'react';

const CalendarBody = styled.div`
  width: 100%;
  height: 100%;
  max-width: 760px;

  display: flex;
  flex-direction: column;

  @media (min-width: 759px) {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
`;

const CalendarHeader = styled.div`
  padding: 15px 30px;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid #eee;
`;
const CalendarHeaderTitle = styled.h1`
  color: #333333;
  margin: 0;
  font-weight: 300;
  font-size: 32px;
`;
const CalendarAddButton = styled.button`
  color: red;
  font-size: 35px;
  font-family: inherit;
  background: none;
  border: none;
  border-radius: 50%;
  height: 45px;
  width: 45px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #eeeeee99;
  }

  &:after {
    content: "+";
  }
`;

const CalendarWeek = styled.div`
  background-color: #fafafa;
  padding: 10px 0px;
  padding-left: 50px;
`;

const CalendarInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
`;

const CalendarFooter = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-top: 1px solid #eee;
  background: #fafafa;
`;

const CalendarButton = styled.button`
  color: red;
  font-size: 19px;
  font-family: inherit;
  background: none;
  border: none;
  border-radius: 5px;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  &:hover {
    background: #eeeeee99;
  }
`;

const CalendarWeekControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CalendarWeekBack = styled.button`
  background: none;
  border: none;
  border-radius: 5px;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;
  width: calc(100% / 7);

  &:after {
    content: "";
    display: block;
    border: solid #FF3131;
    border-width: 0 0 2px 2px;
    padding: 3.5px;
    transform: rotate(45deg);
  }

  &:hover {
    background: #eeeeee99;
  }
`;

const CalendarWeekNext = styled.button`
  background: none;
  border: none;
  border-radius: 5px;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;
  width: calc(100% / 7);

  &:after {
    content: "";
    display: block;
    border: solid #FF3131;
    border-width: 0 0 2px 2px;
    padding: 3.5px;
    transform: rotate(-135deg);
  }

  &:hover {
    background: #eeeeee99;
  }
`;

const CalendarWeekCurrent = styled.div`
  text-align: center;
  font-size: 17px;
`;

const CalendarWeekInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CalendarWeekItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const CalendarWeekDay = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
  text-align: center;
`;
const CalendarWeekDate = styled.div`
  width: 35px;
  height: 35px;

  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CalendarWeekCurrentDate = styled.div`
  width: 35px;
  height: 35px;
  
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  background: #FF3131;
  border-radius: 50%;
  color: #fff;
`;

const CalendarTimeColumn = styled.div`
  width: 60px;
`;

const CalendarTimeCell = styled.div`
  padding: 0;
  height: 40px;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: start;
  color: #666666;
  font-size: 15px;
  position: relative;
  top: -10px;

  &:first-of-type {
    opacity: 0;
    pointer-events: none;
  }
`;

const CalendarTasksColumn = styled.div`
  width: 100%;
`;

const CalendarTasksRow = styled.div`
  width: 100%;
  border-top: 1px solid #dedede;
  display: flex;
  flex-direction: row;

  &:first-of-type {
    border-top: none;
  }
`;

const CalendarTasksCell = styled.div`
  width: calc(100% / 7);
  height: 39px;
  border-left: 1px solid #dedede;

  &:first-of-type {
    border-left: none;
  }
`;

const CalendarTasksCellFilled = styled(CalendarTasksCell)`
  background-color: ${props => {
    return props.selected ? "#B3B7FF" : "#EBECFF"
  }};
  
`;

const daysOfWeek = (date) => {
  const week = [];
  const localDate = new Date(date.getTime());
  localDate.setHours(0, 0, 0, 0);
  const first = localDate.getDate() - localDate.getDay() + 1;
  localDate.setDate(first);
  for (var i = 0; i < 7; i++) {
    week.push(new Date(+localDate));
    localDate.setDate(localDate.getDate()+1);
  }
  return week;
}

const Calendar = () => {
  const today = new Date();

  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [currentDate, setCurrentDate] = useState(today);
  const [pageTasks, setPageTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(false);

  useEffect(() => {
    const week = daysOfWeek(currentDate);
    const firstDay = week[0];
    const lastDay = week[6];
    console.log(firstDay);
    const pageTasks = tasks.filter((el) => {
      return el.timestamp >= firstDay.getTime() && el.timestamp <= lastDay.getTime() + (24 * 60 * 60 * 1000);
    });
    setPageTasks(pageTasks);
    setSelectedTask(false);
  }, [currentDate, tasks]);

  return (
    <CalendarBody>
      <CalendarHeader>
        <CalendarHeaderTitle>Interview Calendar</CalendarHeaderTitle>
        <CalendarAddButton onClick={(e) => {
          const userInput = prompt("Enter event time: YYYY-MM-DD HH:mm:ss");
          const parsedInput = Date.parse(userInput);
          if (!isNaN(parsedInput)) {
            setTasks((tasks) => {
              return [...tasks, { timestamp: parsedInput }];
            });

            alert('Event created!');
          } else {
            alert('Invalid date');
          }
        }}/>
      </CalendarHeader>
      <CalendarWeek>
        <CalendarWeekInner>
          {
            daysOfWeek(currentDate).map((el) => {
              return (
                <CalendarWeekItem key={el.getDay()}>
                  <CalendarWeekDay>{el.toLocaleDateString('en-EN', { weekday: 'short' })[0]}</CalendarWeekDay>
                  {
                    el.toLocaleDateString() === today.toLocaleDateString() ? (<CalendarWeekCurrentDate>{el.getDate()}</CalendarWeekCurrentDate>) : (<CalendarWeekDate>{el.getDate()}</CalendarWeekDate>)
                  }
                </CalendarWeekItem>
              );
            })
          }
        </CalendarWeekInner>
        <CalendarWeekControls>
          <CalendarWeekBack onClick={(e) => {
            setCurrentDate((oldDate) => {
              const newDate = new Date(oldDate.getTime() - 604800000);
              return newDate;
            });
          }}/>
          <CalendarWeekCurrent>{`${currentDate.toLocaleString('en-EN', { month: 'long' })} ${currentDate.getFullYear()}`}</CalendarWeekCurrent>
          <CalendarWeekNext onClick={(e) => {
            setCurrentDate((oldDate) => {
              const newDate = new Date(oldDate.getTime() + 604800000);
              return newDate;
            });
          }}/>
        </CalendarWeekControls>
      </CalendarWeek>
      <CalendarInner>
        <CalendarTimeColumn>
          {
            [...Array(24).keys()].map((hour, i) => {
              return (<CalendarTimeCell key={`c${hour}`}>{`${hour.toString().padStart(2, '0')}:00`}</CalendarTimeCell>);
            })
          }
        </CalendarTimeColumn>
        <CalendarTasksColumn>
          {
            [...Array(24).keys()].map((hour, i) => {
              return (
                <CalendarTasksRow key={hour}>
                  {
                    daysOfWeek(currentDate).map((el) => {
                      let timestamp = el.getTime() + (hour * 60 * 60 * 1000);
                      let start = timestamp;
                      let end = start + (60 * 60 * 1000);
                      if (pageTasks.some(({ timestamp }) => timestamp >= start && timestamp <= end)) {
                        return (
                          <CalendarTasksCellFilled
                            key={timestamp}
                            selected={timestamp === selectedTask}
                            onClick={(e) => {
                              setSelectedTask(timestamp);
                            }} 
                            />
                        );
                      } else {
                        return (
                          <CalendarTasksCell
                            key={timestamp}
                            onClick={(e) => {
                              setSelectedTask(false);
                            }} 
                          />
                        );
                      }
                      
                    })
                  }
                </CalendarTasksRow>
              );
            })
          }
          
        </CalendarTasksColumn>
      </CalendarInner>
      <CalendarFooter>
        <CalendarButton onClick={(e) => {
          setCurrentDate(today);
        }}>Today</CalendarButton>
        {
          selectedTask && <CalendarButton onClick={(e) => {
            const userInput = confirm('Are you sure?');
            if (userInput) {
              let start = selectedTask;
              let end = start + (60 * 60 * 1000);

              setTasks((tasks) => {
                return tasks.filter(({ timestamp }) => !(timestamp >= start && timestamp <= end))
              });
              setSelectedTask(false);
            }
            
          }}>Delete</CalendarButton>
        }
      </CalendarFooter>
    </CalendarBody>
  );
};

export default Calendar;