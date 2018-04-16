package cm.study.gravitation.handler;

import java.util.List;

/**
 * 每一个具体工作
 * Created by chenming on 2017/7/23.
 */
public interface Work {

    WorkResp justDoIt(WorkReq workReq);

    List<Work> next();
}