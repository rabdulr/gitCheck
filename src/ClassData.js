import React, {useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-dropdown-select';
import Col from 'react-bootstrap/Col';

const ClassData = ({avgData}) => {
    const [avgView, setAvgView] = useState();

    return (
        <Row>
            <Col>
                <h3>Class Data</h3>
                <Select options={avgData} onChange={(values) => setAvgView(values[0].avgData)} labelField={'name'} valueField={'avgData'} />
                { avgView ?
                    <LineChart width={900} height={300} data={avgView} margin={{top: 5, right: 0, bottom: 5, left: 0}}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 'auto']}/>
                        <Legend verticalAlign="top" height={10} />
                        <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d" />
                        <Tooltip />
                    </LineChart>
                    : <h4>NO DATA SELECTED</h4>
                }
                {
                    avgData.map(data => {
                        return (
                            <div key={data.name}>
                                <h4>{data.name}</h4>
                                <LineChart width={900} height={300} data={data.avgData} margin={{top: 5, right: 0, bottom: 5, left: 0}}>
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={[0, 'auto']}/>
                                    <Legend verticalAlign="top" height={10} />
                                    <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d" />
                                    <Tooltip />
                                </LineChart>
                            </div>
                        )
                    })
                }
            </Col>
        </Row>
    )
}

export default ClassData
