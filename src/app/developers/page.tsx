'use client'
import { useDeleteDeveloperByIdMutation, useGetDevelopersQuery, useUpdateDeveloperMutation } from "@/redux/services/developersApi";
import useDebounce from "@/hooks/useDebounce";
import { IDeveloper } from "@/types/models/types";
import { Button, Checkbox, Col, Dropdown, Field, Row, RowBetween, Table, TableMenuIcon } from "@/components/ui";
import Paginator from "@/components/ui/Paginator/Paginator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  // table data
  const { data: developers } = useGetDevelopersQuery({
    page: currentPage,
    limit: limit,
    extend: "file",
    like: debouncedSearchValue || "",
    ...(isActive ? {
      "filter[is_active]": isActive,
    } : {}),
  })

  // menu  
  const [deleteDeveloper] = useDeleteDeveloperByIdMutation()
  const [updateDeveloper] = useUpdateDeveloperMutation()

  const handleDelete = async (id: number) => {
    await deleteDeveloper(id)
  }

  const handleToggleActive = async (developer: IDeveloper) => {
    let activeDeveloper: IDeveloper = { ...developer, is_active: !developer.is_active }
    await updateDeveloper(activeDeveloper)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Col>
      <RowBetween>
        <h1>Производители</h1>
        <Button color="green" onClick={() => router.push("/developers/add")}>Добавить</Button>
      </RowBetween>
      <Col>
        <div style={{ display: "grid", gridGap: "10px", gridTemplateColumns: "1fr 1fr 1fr" }}>
          <Field
            label="Поиск"
            placeholder="Поиск по названию"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} />
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
              <th>Активность</th>
              <th>Производитель</th>
              <th>Фото производителя</th>
            </tr>
          </thead>
          <tbody>
            {developers?.data.map(item => {
              return (
                <tr key={item.developer_id}>
                  <td>
                    <Dropdown>
                      <div>
                        <TableMenuIcon />
                      </div>
                      <div>
                        <div onClick={() => handleToggleActive(item)}>{item.is_active ? "Деактивировать" : "Активировать"}</div>
                        <div onClick={() => router.push(`/developers/${item.developer_id}`)}>Изменить</div>
                        <div onClick={() => handleDelete(item.developer_id)} className="danger-hover">Удалить</div>

                      </div>
                    </Dropdown>
                  </td>
                  <td className="gray">{item.developer_id}</td>
                  <td>
                    {item.is_active && <img src="img/icons/checked.svg" width={18} />}
                  </td>
                  <td className="black-500">{item.name}</td>
                  <td>
                    <div className="table-photo">
                      <img src={item.file?.link} alt="" />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Row>
      <Paginator onClick={handlePageChange} currentPage={currentPage} pageCount={Math.ceil((developers?.count ?? 0) / limit) || 0} />
    </Col >
  )
}
