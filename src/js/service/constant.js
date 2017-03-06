/**
 * Created by pro on 2016/11/11.
 */
angular
    .module('inspinia')
    .constant('GenderOptions',
      [
        {'value': 0, 'label':'男'},
        {'value': 1, 'label':'女'}
      ]
    )
    .constant('UserType',
      [
        {'value':'doctor','label':'医生'},
        {'value':'editor','label':'编辑'},
        {'value':'user','label':'普通用户'},
        {'value':'robot','label':'马甲'}
      ]
    )
    .constant('Statuses',
      [
        {'value': 0,'label':'未发布'},
        {'value': 1,'label':'已发布'},
        {'value': 2,'label':'所有'}
      ]
    )
  .constant('TYPES',
    [
      {'value': 'all','label':'全部'},
      {'value': 'user','label':'用户'},
      {'value': 'doctor','label':'医生'},
      {'value': 'editor','label':'编辑'}
    ]
  )
;
