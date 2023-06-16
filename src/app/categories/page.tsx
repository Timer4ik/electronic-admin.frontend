'use client'
import { useDeleteCategoryMutation, useFetchAllCategoriesQuery, useUpdateCategoryMutation } from "@/redux/services/categories";
import useDebounce from "@/hooks/useDebounce";
import { ICategory } from "@/types/models/types";
import { Button, Col, Dropdown, Field, Row, RowBetween, Table, TableMenuIcon } from "@/components/ui";
import Paginator from "@/components/ui/Paginator/Paginator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter()

  // pagination
  const [limit, setLimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  // filter - search
  const [searchValue, setSearchValue] = useState<string>("")
  const debouncedSearchValue = useDebounce(searchValue, 800)

  // table data
  const { categories, refetch } = useFetchAllCategoriesQuery({
    limit,
    page: currentPage,
    extendParent: "true",
    extend: "file",
    like: debouncedSearchValue || ""
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
    refetch()
  }

  const handleToggleActive = async (category: ICategory) => {
    let activeCategory: ICategory = { ...category, is_active: !category.is_active }
    await updateCategory(activeCategory)
    refetch()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }


  useEffect(() => {
    refetch()
  }, [])

  return (
    <Col>
      <RowBetween>
        <h1>Категории товаров</h1>
        <Button color="green" onClick={() => router.push("/categories/add")}>Добавить</Button>
      </RowBetween>
      <RowBetween>
        <Field
          placeholder="Поиск по названию"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} />
      </RowBetween>
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
                    {item.is_active && <img src="img/icons/checked.svg" width={18} />}
                  </td>
                  <td>
                    {item.is_end && <img src="img/icons/checked.svg" width={18} />}
                  </td>
                  <td>
                    <div className="table-photo">
                      <img src={item.file?.link} alt="" />
                    </div>
                  </td>
                  <td>{item?.parent?.name}</td>
                </tr>
              )
            })}

          </tbody>
        </Table>
      </Row>
      <Paginator onClick={handlePageChange} currentPage={currentPage} pageCount={((categories?.count ?? 0) / limit) || 0} />
    </Col >
  )
}
