package cm.study.gravitation.orm

import java.sql.ResultSet

import org.scalatest.FunSuite
import cm.study.gravitation.orm.ORM._
import cm.study.gravitation.orm.Select

class SelectTest extends FunSuite {

  val config = DBConfig("jdbc:mysql://172.17.48.20:3306/MEIZU_DURIAN_STAT?characterEncoding=utf-8&cacheServerConfiguration=true&useLocalSessionState=true", "mysqluser", "mysqluser")

  test("select use sql and map") {
    val list = SELECT.on(config).sql("select FPLANID, FUNITID, FIDEAID, FEXPOSE_COUNT, FCLICK_COUNT, FTOTAL_COST from T_AD_STAT limit 10")
      .map(rs => {
        AdStat(rs.getInt("FPLANID"), rs.getInt("FUNITID"), rs.getInt("FIDEAID"),
            rs.getInt("FEXPOSE_COUNT"), rs.getInt("FCLICK_COUNT"), rs.getInt("FTOTAL_COST"))
        }
      )

    print("---> " + list)
  }

  test("tuple") {
    val tup = (1, 2, 3, 4)
    tup.productIterator.foreach(v => println("--> " + v))
  }

}
