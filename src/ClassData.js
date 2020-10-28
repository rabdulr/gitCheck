import React from 'react';
import Row from 'react-bootstrap/Row';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Col from 'react-bootstrap/Col';

const ClassData = ({avgData}) => {

    return (
        <Row>
            <Col>
                {
                    avgData.map(data => {
                        return (
                            <div key={data.name}>
                                <h4>{data.project.name}</h4>
                                <h6>{new Date(data.project.startDate).toLocaleDateString()}</h6>
                                <ResponsiveContainer width="95%" height={300}>
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
