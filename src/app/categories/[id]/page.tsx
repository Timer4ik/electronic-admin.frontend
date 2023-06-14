'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormikForm, { FormikFieldsTemplate, TemplateFields, TemplateTypes, generateInitialObject } from '@/components/form/FormikForm'
import { useUpdateCategoryMutation, useFetchAllCategoriesQuery, useFetchCategoryByIdQuery } from '@/api/categories'
import { useParams, useRouter } from 'next/navigation'
import { ICategory } from '@/types/models/types'
import { Button, Card, Col, Row, Tabs, TabsItem } from '@/ui-kit'
import { Form, Formik } from 'formik'
import { useCategoryPage } from '@/hooks/useCategoryPage'


const CategoryEditPage = () => {

    const router = useRouter()
    const params = useParams()

    const { data: categories, refetch: refetchCategories } = useFetchAllCategoriesQuery({})

    const { data: category, refetch: refetchCategory } = useFetchCategoryByIdQuery(+params?.id)

    const [updateCategory, { isLoading }] = useUpdateCategoryMutation()

    const [selectedTab, setSelectedTab] = useState(0)

    const {
        fieldsTemplateTab1, fieldsTemplateTab2, initialValues
    } = useCategoryPage(category?.data, categories?.data)


    return (
        <div>
            <Row>
                <h2>Редактирование категории товара - {category?.data?.name}({category?.data?.category_id})</h2>
            </Row>
            <Card>
                <Col>
                    <Row>
                        <Tabs>
                            <TabsItem active={selectedTab == 0} onClick={() => setSelectedTab(0)}>Основная информация</TabsItem>
                            <TabsItem active={selectedTab == 1} onClick={() => setSelectedTab(1)}>Дополнительные данные</TabsItem>
                        </Tabs>
                    </Row>
                    {category?.data && <Formik initialValues={initialValues}
                        onSubmit={async (values: any) => {
                            await updateCategory({
                                category_id: category?.data?.category_id,
                                name: values.name,
                                is_end: values.is_end,
                                photo: values.photo_full.file,
                                desc:values.desc,
                                is_active: values.is_active,
                                parent_id: values.parent_category.value
                            })
                            refetchCategory()
                            router.back()
                        }}
                    >
                        <Form>
                            {selectedTab == 0 && <FormikFieldsTemplate fieldsTemplate={fieldsTemplateTab1(category?.data)} />}
                            {selectedTab == 1 && <FormikFieldsTemplate fieldsTemplate={fieldsTemplateTab2(category?.data)} />}
                            <Button type='submit'>Сохранить</Button>
                        </Form>
                    </Formik>}
                </Col>
            </Card>
        </div>
    )
}

export default CategoryEditPage


// 'use client'
// import React, { useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import { useUpdateCategoryMutation, useFetchAllCategoriesQuery, useFetchCategoryByIdQuery } from '@/api/categories'
// import { AdaptiveImage, Button, Card, Checkbox, Col, Field, PhotoLoader, Row, RowBetween, Select, SelectOption, Tabs, TabsItem } from '@/ui-kit'
// import { useFormik } from "formik"
// import { ICategory } from '@/types/models/types'


// const CategoryEditPage = () => {

//     const fieldsTemplate = [
//         {
//         },
//         {
//         }
//     ]

//     const params = useParams()

//     const { data: categories } = useFetchAllCategoriesQuery("")
//     const { data: category, isSuccess } = useFetchCategoryByIdQuery(+params?.id)

//     const [updateCategory, { isLoading }] = useUpdateCategoryMutation()


//     useEffect(() => {

//     }, [isSuccess])


//     return (
//         <>
//             <Row>
//                 <h2>Редактирование категории товара - {category?.data?.name}({category?.data?.category_id})</h2>
//             </Row>
//             <Card>
//                 <Row>
//                     <Tabs>
//                         <TabsItem active>Привет</TabsItem>
//                         <TabsItem>Привет</TabsItem>
//                         <TabsItem>Привет</TabsItem>
//                         <TabsItem>Привет</TabsItem>
//                     </Tabs>
//                 </Row>
//                 <Row>
//                     <form>
//                         <Col>
//                             <Field label='Название категории' type="text" />
//                             <Select selectedItem={"Не выбрано"} label="Выбор родительской категории">
//                                 <SelectOption>Не выбрано</SelectOption>
//                             </Select>
//                             <Checkbox label='Конечная категория' type="checkbox" />
//                             <PhotoLoader label='Фото Категории' />

//                             <Button type="submit">Сохранить</Button>
//                         </Col>
//                     </form>
//                 </Row>

//             </Card >
//         </>
//     )
// }

// export default CategoryEditPage