import React, { useState, useEffect } from 'react';
import { Spin, Space, Button, Select, Input, Form } from 'antd';
import { Store } from 'antd/lib/form/interface';
import GoogleMapReact from 'google-map-react';
import * as dotenv from 'dotenv';
import Header from './components/Header';
import Marker from './components/Marker';
import api from './services/api';
import './App.css';

dotenv.config();

interface IPosition {
  latitude: number;
  longitude: number;
  id: string;
}

interface IPath {
  path: string;
}
// https://agropoint-csv.s3-sa-east-1.amazonaws.com/sample.test.csv

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [paths, setPaths] = useState<IPath[]>([]);
  const [positionsMap, setPositionsMap] = useState<IPosition[]>([]);

  const validateMessages = {
    required: 'Por favor, informe o campo!',
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const { Option } = Select;

  const handleFinish = async (values: Store) => {
    setIsLoading(true);
    const { url } = values;
    const response = await api.post('/', {
      url,
    });
    const { positions } = response.data;

    setPositionsMap(positions);
    setIsLoading(false);
  };

  const handleLoadPositions = async (values: Store) => {
    setIsLoading(true);
    const { url } = values;

    const response = await api.post('/positions', {
      url,
    });

    setPositionsMap(response.data.positions);
    setIsLoading(false);
  };

  useEffect(() => {
    async function getComboBoxData() {
      const response = await api.get<IPath[]>('/paths');

      setPaths(response.data);
    }

    getComboBoxData();
  }, []);

  return (
    <div className="container">
      <Header />

      <Button
        type="default"
        id="btn-is-new"
        onClick={() => setIsNew(!isNew)}
        style={{
          marginBottom: '1rem',
        }}
      >
        {isNew ? 'Carregar um mapa existente' : 'Importar um novo csv'}
      </Button>

      {!isNew && (
        <Form
          form={form}
          {...layout}
          layout="vertical"
          initialValues={{ layout: 'vertical' }}
          name="form-download-csv"
          onFinish={handleLoadPositions}
          validateMessages={validateMessages}
        >
          <Form.Item {...layout} name="url" rules={[{ required: true }]}>
            <Select size="large">
              {paths.map((data) => {
                return (
                  <Option key={data.path} value={data.path}>
                    {data.path}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: '1rem' }}>
            <Button type="primary" htmlType="submit">
              Carregar
            </Button>
          </Form.Item>
        </Form>
      )}

      {isNew && (
        <Form
          form={form}
          {...layout}
          layout="vertical"
          initialValues={{ layout: 'vertical' }}
          name="form-upload-csv"
          onFinish={handleFinish}
          validateMessages={validateMessages}
        >
          <Form.Item {...layout} name="url" rules={[{ required: true }]}>
            <Input size="large" placeholder="Digite uma url contendo um CSV" />
          </Form.Item>

          <Form.Item style={{ marginTop: '1rem' }}>
            <Button type="primary" htmlType="submit">
              Importar
            </Button>
          </Form.Item>
        </Form>
      )}

      <div className="map">
        {isLoading && (
          <Space size="large">
            <Spin size="large" />
          </Space>
        )}

        {!isLoading && (
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
            }}
            defaultCenter={{ lat: -23.5085732, lng: -46.874006 }}
            zoom={11}
          >
            {positionsMap.map((position) => (
              <Marker
                id={position.id}
                lat={position.latitude}
                lng={position.longitude}
                name="My Marker"
                color="blue"
              />
            ))}
          </GoogleMapReact>
        )}
      </div>
    </div>
  );
};

export default App;
