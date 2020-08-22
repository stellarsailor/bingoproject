export default function MakeBingoButton () {
    let str = '나만의 빙고 만들기'

    let size = Math.ceil(str.length / 8) //2

    const chunks = new Array(8)

    for(let i = 0, o = 0; i < 8; ++i, o+=size ){
        chunks[i] = str.substr(o, size)
    }

    console.log(chunks)

    const renderTable = (arr, size) => {
        let rows = []
        for(let i = 0; i < size; i++ ){
            rows.push(
                <tr>
                    {arr.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td style={{border: '5px solid black'}}>
                                    {v}
                                </td>
                            )
                        }
                    })}
                </tr>
            )
        }
        console.log(rows)
        return rows
    }

    return (
        <>
        </>
    )
}