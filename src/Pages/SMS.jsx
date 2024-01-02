import React from 'react'
import { Tabs } from 'antd'

import Send_SMS from '../Components/Send_SMS';
import Find_SMS from '../Components/Find_SMS';
import { Speech_To_Text } from '../Components/Speech_To_Text';
import Bill_Generator from './Bill_Generator';
import Step_Context from '../Context/Step_Context';
import Bill_Context from '../Context/Bill_Context';
import RatesContext from '../Context/RatesContext';
import RatesComp from '../Components/RatesComp';
import Bill_Listing from './Bill_Listing';
import CreateNewPost from '../Components/CreateNewPost';

export const SMS = () => {
    return (
        <div>
            <Tabs defaultActiveKey="2" tabPosition='top' type='card'>
                <Tabs.TabPane tab="Send SMS" key="1">
                    <Send_SMS />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Search SMS" key="2" >
                    <Bill_Listing/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Bill Generate" key="3">
                    <RatesContext>
                        <RatesComp/>
                        <Step_Context>
                            <Bill_Context>
                                <Bill_Generator />
                            </Bill_Context>
                        </Step_Context>
                    </RatesContext>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Create Post" key="4" >
                    <CreateNewPost/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default SMS;