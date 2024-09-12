import React, { useContext, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, Table, Image, Card, Space, Tag, Switch } from 'antd';
import { toast } from 'react-toastify';
import { export_url, IMG_URL } from '../../../configs/app-global';
import { Context } from '../../../context/context';
import CustomModal from '../../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import productService from '../../../services/seller/product';
import { fetchSellerProducts } from '../../../redux/slices/product';
import { useTranslation } from 'react-i18next';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import SearchInput from '../../../components/search-input';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import { CgImport } from 'react-icons/cg';
import RiveResult from '../../../components/rive-result';
import CreateFood from './createFood';
import UpdateFood from './update-food';
import { useNavigate } from 'react-router-dom';
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const SellerProduct = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [update, setUpdate] = useState(null);
  const [id, setId] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState(null);
  const [active, setActive] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { products, meta, loading, params } = useSelector(
    (state) => state.product,
    shallowEqual
  );
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const goToEdit = (uuid) => {
    dispatch(
      addMenu({
        id: 'product-edit',
        url: `seller/product/${uuid}`,
        name: t('edit.product'),
      })
    );
    navigate(`/seller/product/${uuid}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('image'),
      dataIndex: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            width={100}
            src={!row.deleted_at ? IMG_URL + img : 'https://fakeimg.pl/640x360'}
            placeholder
            style={{ borderRadius: 4 }}
          />
        );
      },
    },
    {
      title: t('name'),
      dataIndex: 'name',
      is_show: true,
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div>
          {status === 'published' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'unpublished' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            {row.locales?.map((item, index) => (
              <Tag className='text-uppercase' color={[colors[index]]}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: t('shop'),
      dataIndex: 'shop_id',
      is_show: true,
      render: (_, row) => {
        return row.shop.translation?.title;
      },
    },
    {
      title: t('category'),
      dataIndex: 'category_name',
      is_show: true,
    },
    {
      title: t('active'),
      dataIndex: 'active',
      is_show: true,
      render: (active, row) => {
        return <Switch   onChange={() => {
          setIsModalVisible(true);
          setId(row.uuid);
          setActive(true);
        }} checked={active} />;
      },
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row.uuid)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setId({ product_id: [row.id] });
                setText(true);
              }}
              disabled={row.deleted_at}
            />
          </Space>
        );
      },
    },
  ]);

  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    brand_id: data?.brand?.value,
    category_id: data?.category?.value,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
  };

  const productDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.product_id?.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    productService
      .delete(params)
      .then(() => {
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerProducts(params));
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    dispatch(fetchSellerProducts(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerProducts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      })
    );
  };

  const excelExport = () => {
    setDownloading(true);
    const body = {
      shop_id: myShop?.id,
    };
    productService
      .export(body)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const rowSelection = {
    selectedRowKeys: id?.product_id || [],
    onChange: (selectedRowKeys, row) => {
      setId({
        ...id,
        product_id: selectedRowKeys,
        parent_id: row.map((row) => row.parent_id),
      });
      console.log(selectedRowKeys);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const handleCancel = () => {
    setUpdate(null);
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setUpdate(true);
    }
  };

  const handleActive = () => {
    setLoadingBtn(true);
    productService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchSellerProducts(paramsData));
        toast.success(t('successfully.updated'));
        setActive(true);
      })
      .finally(() => setLoadingBtn(false));
  };

  // const timeCalculate = [
  //   8, 15, 10, 7, 15, 10, 5, 5, 15, 3, 4, 8, 4, 40, 12, 18, 26,
  // ];

  // console.log(timeCalculate.reduce((acc, item) => (acc += item)));

  return (
    <React.Fragment>
      <Card className='p-0'>
        <Space wrap size={[10, 20]}>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={() => setIsModalOpen(true)}
          >
            {t('add.food')}
          </Button>
          <Button icon={<UndoOutlined />} type='primary' onClick={handleUpdate}>
            {t('update.foods')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
            className={'w-100'}
          />
          <Button onClick={excelExport} loading={downloading}>
            <CgImport className='mr-2' />
            {t('import')}
          </Button>

          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
        </Space>
      </Card>

      <Card title={t('food')}>
        <Table
          locale={{
            emptyText: <RiveResult />,
          }}
          scroll={{ x: true }}
          rowSelection={rowSelection}
          loading={loading}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={products}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          onChange={onChangePagination}
          rowKey={(record) => record.id}
        />
      </Card>
      <CustomModal
        click={active ? handleActive : productDelete}
        loading={loadingBtn}
        text={
          active ? t('set.active.food') : text ? t('delete') : t('all.delete')
        }
        setText={setId}
        setActive={setActive}
      />

      {isModalOpen && (
        <CreateFood handleCancel={handleCancel} isModalOpen={isModalOpen} />
      )}
      {update && (
        <UpdateFood
          handleCancel={handleCancel}
          isModalOpen={update}
          id={id}
          setId={setId}
          paramsData={paramsData}
        />
      )}
    </React.Fragment>
  );
};

export default SellerProduct;
