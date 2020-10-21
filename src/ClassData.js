import React, {useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-dropdown-select';
import Col from 'react-bootstrap/Col';

const ClassData = ({avgData}) => {
    const [avgView, setAvgView] = useState();

    return (
        <Row>
            <Col style={{paddingLeft: "0"}}>
                {
                    avgData.map(data => {
                        return (
                            <div key={data.name}>
                                <h4>{data.project.name}</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data.avgData} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="day" />
                                        <YAxis domain={[0, 'auto']} allowDecimals={false} />
                                        <Legend verticalAlign="top" height={10} />
                                        <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d" />
                                        <Tooltip />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )
                    })
                }
            </Col>
        </Row>
    )
}

export default ClassData
