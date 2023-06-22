'use client'
import { useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "@/redux/services/categoriesApi";
import useDebounce from "@/hooks/useDebounce";
import { ICategory } from "@/types/models/types";
import { Button, Checkbox, Col, Dropdown, Field, Row, RowBetween, Select, Table, TableMenuIcon } from "@/components/ui";
import Paginator from "@/components/ui/Paginator/Paginator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SelectOption } from "@/components/ui/Select/Select";

export default function Home() {

  const router = useRouter()

  // pagination
  const [limit, setLimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // filter - search
  const [searchValue, setSearchValue] = useState<string>("")
  const debouncedSearchValue = useDebounce(searchValue, 800)

  // filter - isactive
  const [isActive, setIsActive] = useState(false)

  // filter - select category
  const { data: parentCategories } = useGetCategoriesQuery({})
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>(0)

  // table data
  const { categories } = useGetCategoriesQuery({
    limit,
    page: currentPage,
    extendParent: "true",
    extend: "file",
    like: debouncedSearchValue || "",
    ...(isActive ? {
      "filter[is_active]": isActive,
    } : {}),
    ...(selectedCategoryId ? {
      "filter[parent_id]": selectedCategoryId,
    } : {}),
  }, {
    selectFromResult({ data }) {
      return {
        categories: data,
      }
    }
  })
  // menu
  const [deleteCategory] = useDeleteCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()

  const handleDelete = async (id: number) => {
    await deleteCategory(id)
  }

  const handleToggleActive = async (category: ICategory) => {
    let activeCategory: ICategory = { ...category, is_active: !category.is_active }
    await updateCategory(activeCategory)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return categories?.data && parentCategories?.data ? (
    <Col>
      <RowBetween>
        <h1>Категории товаров</h1>
        <Button color="green" onClick={() => router.push("/categories/add")}>Добавить</Button>
      </RowBetween>
      <Col>
        <div style={{ display: "grid", gridGap: "10px", gridTemplateColumns: "1fr 1fr" }}>
          <Field
            label="Поиск"
            placeholder="Поиск по названию"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} />
          <Select
            label="Выберите родительскую категорию"
            onChange={(item) => setSelectedCategoryId(item)}
            value={selectedCategoryId}
          >
            <SelectOption value={0}>Не выбрано</SelectOption>
            {parentCategories?.data?.map(item => {
              return <SelectOption key={item.category_id} value={item.category_id}>{item.name}</SelectOption>
            })}
          </Select>
          {/*<Select
            label="Выберите производителя"
            onChange={(item) => setSelectedDeveloperId(item)}
            value={selectedDeveloperId}
          >
            <SelectOption value={0}>Не выбрано</SelectOption>
            {developers?.data?.map(item => {
              return <SelectOption key={item.developer_id} value={item.developer_id}>{item.name}</SelectOption>
            })}
          </Select> */}
        </div>
        <Checkbox label="Активность"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)} />
      </Col>
      <Row>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Название категории</th>
              <th>Активность</th>
              <th>Конечная категория?</th>
              <th>Фото</th>
              <th>Родительская категория</th>
            </tr>
          </thead>
          <tbody>
            {categories?.data.map(item => {
              return (
                <tr key={item.category_id}>
                  <td>
                    <Dropdown>
                      <div>
                        <TableMenuIcon />
                      </div>
                      <div>
                        <div onClick={() => handleToggleActive(item)}>{item.is_active ? "Деактивировать" : "Активировать"}</div>
                        <div onClick={() => router.push(`categories/${item.category_id}`)}>Изменить</div>
                        <div onClick={() => handleDelete(item.category_id)} className="danger-hover">Удалить</div>
                      </div>
                    </Dropdown>
                  </td>
                  <td className="gray">{item.category_id}</td>
                  <td className="black-500">{item.name}</td>
                  <td>
                    {item.is_active && <Image width={18} height={18} src="img/icons/checked.svg" alt="" />}
                  </td>
                  <td>
                    {item.is_end && <Image width={18} height={18} src="img/icons/checked.svg" alt="" />}
                  </td>
                  <td>
                    <div className="table-photo">
                      <Image width={0} height={0} src={item.file?.link || ""} alt="" />
                    </div>
                  </td>
                  <td>{item?.parent?.name}</td>
                </tr>
              )
            })}

          </tbody>
        </Table>
      </Row>
      <Paginator onClick={handlePageChange} currentPage={currentPage} pageCount={Math.ceil((categories?.count ?? 0) / limit) || 0} />
    </Col >
  ) : null
}
